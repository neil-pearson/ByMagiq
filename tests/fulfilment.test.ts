import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fulfilCheckoutSession,
  type CheckoutSessionLike,
  type Delivery,
  type FulfilmentDeps,
} from "@/lib/fulfilment";

type Status = "received" | "sending" | "delivered" | "failed";
type SendArgs = Parameters<FulfilmentDeps["sendEmail"]>[0];

/**
 * In-memory stand-in for the orders table and its claim function, following
 * the same rules as scripts/sql/010: a claim succeeds for 'received' or
 * 'failed' orders and fails for 'sending' or 'delivered' ones.
 */
function makeDeps(
  opts: {
    delivery?: Delivery | null;
    getDeliveryThrows?: boolean;
    sendFailsTimes?: number;
    markDeliveredThrows?: boolean;
  } = {}
) {
  const orders = new Map<string, { status: Status; lastError: string | null }>();
  let sendFailuresLeft = opts.sendFailsTimes ?? 0;

  const deps = {
    recordOrder: vi.fn(async (s: CheckoutSessionLike) => {
      if (!orders.has(s.id)) {
        orders.set(s.id, { status: "received", lastError: null });
      }
    }),
    claimDelivery: vi.fn(async (id: string) => {
      const o = orders.get(id);
      if (!o || (o.status !== "received" && o.status !== "failed")) return false;
      o.status = "sending";
      return true;
    }),
    getDelivery: vi.fn(async (_promptId: string) => {
      if (opts.getDeliveryThrows) throw new Error("db down");
      return opts.delivery === undefined
        ? ({ deliveryType: "text", deliveryContent: "the prompt text" } as Delivery)
        : opts.delivery;
    }),
    sendEmail: vi.fn(async (_args: SendArgs) => {
      if (sendFailuresLeft > 0) {
        sendFailuresLeft -= 1;
        throw new Error("Resend error");
      }
    }),
    markDelivered: vi.fn(async (id: string) => {
      if (opts.markDeliveredThrows) throw new Error("db error");
      const o = orders.get(id)!;
      o.status = "delivered";
      o.lastError = null;
    }),
    markFailed: vi.fn(async (id: string, reason: string) => {
      const o = orders.get(id)!;
      o.status = "failed";
      o.lastError = reason;
    }),
  } satisfies FulfilmentDeps;

  return { deps, orders };
}

const session = (over: Partial<CheckoutSessionLike> = {}): CheckoutSessionLike => ({
  id: "cs_test_1",
  payment_status: "paid",
  amount_total: 900,
  currency: "aud",
  customer_details: { email: "buyer@example.com" },
  metadata: { promptId: "item-1", promptTitle: "Goal to 12-Week Plan" },
  ...over,
});

beforeEach(() => {
  // The module logs expected problems; keep test output readable.
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("fulfilCheckoutSession", () => {
  it("delivers a paid session once and marks it delivered", async () => {
    const { deps, orders } = makeDeps();
    const result = await fulfilCheckoutSession(session(), deps);

    expect(result).toBe("delivered");
    expect(deps.sendEmail).toHaveBeenCalledTimes(1);
    expect(deps.sendEmail).toHaveBeenCalledWith({
      to: "buyer@example.com",
      promptTitle: "Goal to 12-Week Plan",
      deliveryType: "text",
      deliveryContent: "the prompt text",
    });
    expect(orders.get("cs_test_1")?.status).toBe("delivered");
  });

  it("ignores an unpaid session without recording or emailing", async () => {
    const { deps } = makeDeps();
    const result = await fulfilCheckoutSession(
      session({ payment_status: "unpaid" }),
      deps
    );

    expect(result).toBe("ignored");
    expect(deps.recordOrder).not.toHaveBeenCalled();
    expect(deps.sendEmail).not.toHaveBeenCalled();
  });

  it("does not deliver twice when the same event is replayed", async () => {
    const { deps } = makeDeps();
    expect(await fulfilCheckoutSession(session(), deps)).toBe("delivered");
    expect(await fulfilCheckoutSession(session(), deps)).toBe("duplicate");

    expect(deps.sendEmail).toHaveBeenCalledTimes(1);
  });

  it("does not deliver twice when two events arrive together", async () => {
    const { deps } = makeDeps();
    const [a, b] = await Promise.all([
      fulfilCheckoutSession(session(), deps),
      fulfilCheckoutSession(session(), deps),
    ]);

    expect([a, b].sort()).toEqual(["delivered", "duplicate"]);
    expect(deps.sendEmail).toHaveBeenCalledTimes(1);
  });

  it("records a paid session with no email as failed and does not retry", async () => {
    const { deps, orders } = makeDeps();
    const result = await fulfilCheckoutSession(
      session({ customer_details: { email: null } }),
      deps
    );

    expect(result).toBe("ignored");
    expect(deps.sendEmail).not.toHaveBeenCalled();
    expect(orders.get("cs_test_1")).toEqual({
      status: "failed",
      lastError: "no customer email",
    });
  });

  it("records a paid session with no item id as failed and does not retry", async () => {
    const { deps, orders } = makeDeps();
    const result = await fulfilCheckoutSession(session({ metadata: {} }), deps);

    expect(result).toBe("ignored");
    expect(deps.sendEmail).not.toHaveBeenCalled();
    expect(orders.get("cs_test_1")?.lastError).toBe("no promptId in metadata");
  });

  it("asks for a retry, and records the failure, when the email fails; the retry delivers", async () => {
    const { deps, orders } = makeDeps({ sendFailsTimes: 1 });

    expect(await fulfilCheckoutSession(session(), deps)).toBe("retry");
    expect(orders.get("cs_test_1")?.status).toBe("failed");
    expect(orders.get("cs_test_1")?.lastError).toContain("email failed");

    expect(await fulfilCheckoutSession(session(), deps)).toBe("delivered");
    expect(orders.get("cs_test_1")?.status).toBe("delivered");
    expect(deps.sendEmail).toHaveBeenCalledTimes(2);
  });

  it("asks for a retry when the delivery lookup throws", async () => {
    const { deps, orders } = makeDeps({ getDeliveryThrows: true });

    expect(await fulfilCheckoutSession(session(), deps)).toBe("retry");
    expect(deps.sendEmail).not.toHaveBeenCalled();
    expect(orders.get("cs_test_1")?.lastError).toContain("delivery lookup failed");
  });

  it("asks for a retry, without emailing, when the item has no delivery content", async () => {
    const { deps, orders } = makeDeps({ delivery: null });

    expect(await fulfilCheckoutSession(session(), deps)).toBe("retry");
    expect(deps.sendEmail).not.toHaveBeenCalled();
    expect(orders.get("cs_test_1")?.lastError).toBe("item has no delivery content");
  });

  it("still reports delivered if only the bookkeeping update fails after the email is sent", async () => {
    const { deps } = makeDeps({ markDeliveredThrows: true });

    expect(await fulfilCheckoutSession(session(), deps)).toBe("delivered");
    expect(deps.sendEmail).toHaveBeenCalledTimes(1);
  });

  it("uses a generic title when the session has none", async () => {
    const { deps } = makeDeps();
    await fulfilCheckoutSession(
      session({ metadata: { promptId: "item-1" } }),
      deps
    );

    expect(deps.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ promptTitle: "your purchase" })
    );
  });
});
