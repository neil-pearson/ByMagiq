"use client";

import { track } from "@vercel/analytics";
import type { FormEvent, ReactNode } from "react";

/**
 * Wraps a form to fire a Vercel Analytics custom event on submit.
 *
 * Deliberately does NOT touch submission behaviour (no preventDefault,
 * no action wiring) — that's the separate MailerLite integration task.
 * This only adds conversion tracking on top of whatever the form already
 * does.
 */
export default function ConversionForm({
  event,
  className,
  id,
  children,
}: {
  event: string;
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  function handleSubmit(_e: FormEvent<HTMLFormElement>) {
    track(event);
  }

  return (
    <form id={id} className={className} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}
