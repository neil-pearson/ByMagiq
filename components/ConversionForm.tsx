"use client";

import { track } from "@vercel/analytics";
import { useState, type FormEvent, type ReactNode } from "react";

type Group = "newsletter" | "latticaxon-waitlist";

/**
 * Wraps a form to actually submit to MailerLite (via /api/subscribe) and
 * fire a Vercel Analytics custom event on success.
 */
export default function ConversionForm({
  event,
  group,
  className,
  id,
  children,
}: {
  event: string;
  group: Group;
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    if (typeof email !== "string" || !email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, group }),
      });
      if (!res.ok) throw new Error("Subscribe request failed");
      track(event);
      setStatus("success");
      form.reset();
    } catch (err) {
      console.error("Subscribe failed", err);
      setStatus("error");
    }
  }

  return (
    <div>
      <form id={id} className={className} onSubmit={handleSubmit}>
        {children}
      </form>
      {status === "success" && (
        <p className="mt-3 text-sm text-signal">
          You&apos;re in — check your inbox to confirm.
        </p>
      )}
      {status === "error" && (
        <p className="mt-3 text-sm text-red-500">
          Something went wrong — please try again, or email us directly.
        </p>
      )}
    </div>
  );
}
