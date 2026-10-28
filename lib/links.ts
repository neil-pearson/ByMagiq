/**
 * Link to the companion site (Scrhoz).
 *
 * Falls back to the domain that is live today (scriptinghorizons.com, which will
 * redirect to scrhoz.com at go-live). Once scrhoz.com is attached, set
 * NEXT_PUBLIC_SCRHOZ_URL=https://scrhoz.com in Vercel and redeploy.
 */
export const SCRHOZ_URL =
  process.env.NEXT_PUBLIC_SCRHOZ_URL || "https://scriptinghorizons.com";
