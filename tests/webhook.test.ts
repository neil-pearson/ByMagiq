import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  constructEvent: vi.fn(),
  fulfil: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  stripe: { webhooks: { constructEvent: mocks.constructEvent } },
}));
vi.mock("@/lib/fulfilment", () => ({
  fulfilCheckoutSession: mocks.fulfil,
}));
vi.mock("@/lib/fulfilment-deps", () => ({
  getFulfilmentDeps: () => ({}),
}));

import { POST } from "@/app/api/stripe/webhook/route";

function request(headers: Record<string, string> = { "stripe-signature": "sig" }) {
  return new NextRequest("http://localhost/api/stripe/webhook", {
    method: "POST",
    body: JSON.stringify({ any: "payload" }),
    headers,
  });
}

const completedEvent = {
  type: "checkout.session.completed",
  data: { object: { id: "cs_test_1", payment_status: "paid" } },
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
});

describe("POST /api/stripe/webhook", () => {
  it("rejects a request with no signature header", async () => {
    const res = await POST(request({}));

    expect(res.status).toBe(400);
    expect(mocks.constructEvent).not.toHaveBeenCalled();
    expect(mocks.fulfil).not.toHaveBeenCalled();
  });

  it("answers 500 when the webhook secret is not configured", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const res = await POST(request());

    expect(res.status).toBe(500);
    expect(mocks.fulfil).not.toHaveBeenCalled();
  });

  it("rejects an invalid signature and does not fulfil", async () => {
    mocks.constructEvent.mockImplementation(() => {
      throw new Error("bad signature");
    });
    const res = await POST(request());

    expect(res.status).toBe(400);
    expect(mocks.fulfil).not.toHaveBeenCalled();
  });

  it("verifies the raw body with the configured secret", async () => {
    mocks.constructEvent.mockReturnValue(completedEvent);
    mocks.fulfil.mockResolvedValue("delivered");
    await POST(request());

    expect(mocks.constructEvent).toHaveBeenCalledWith(
      JSON.stringify({ any: "payload" }),
      "sig",
      "whsec_test"
    );
  });

  it("acknowledges other event types without fulfilling", async () => {
    mocks.constructEvent.mockReturnValue({ type: "charge.succeeded", data: {} });
    const res = await POST(request());

    expect(res.status).toBe(200);
    expect(mocks.fulfil).not.toHaveBeenCalled();
  });

  it.each(["delivered", "duplicate", "ignored"])(
    "answers 200 when fulfilment returns %s",
    async (result) => {
      mocks.constructEvent.mockReturnValue(completedEvent);
      mocks.fulfil.mockResolvedValue(result);
      const res = await POST(request());

      expect(res.status).toBe(200);
      expect(mocks.fulfil).toHaveBeenCalledTimes(1);
    }
  );

  it("answers 500 so Stripe retries when delivery did not complete", async () => {
    mocks.constructEvent.mockReturnValue(completedEvent);
    mocks.fulfil.mockResolvedValue("retry");
    const res = await POST(request());

    expect(res.status).toBe(500);
  });

  it("answers 500 so Stripe retries when fulfilment throws", async () => {
    mocks.constructEvent.mockReturnValue(completedEvent);
    mocks.fulfil.mockRejectedValue(new Error("database unreachable"));
    const res = await POST(request());

    expect(res.status).toBe(500);
  });
});
