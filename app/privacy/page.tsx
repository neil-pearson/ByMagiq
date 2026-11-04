import type { Metadata } from "next";
import { LEGAL, LEGAL_READY } from "@/lib/legal";
import {
  ContactEmail,
  LegalDoc,
  SellerName,
  type LegalSection,
} from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy — ByMagiq",
  description:
    "What personal information ByMagiq collects, why, who handles it, and how to ask us about it.",
  alternates: { canonical: "/privacy" },
  // A draft until the seller details are confirmed (lib/legal.ts).
  robots: LEGAL_READY ? undefined : { index: false, follow: false },
};

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      <>
        This page explains how <SellerName />
        {LEGAL.abn ? ` (ABN ${LEGAL.abn})` : ""} handles personal information
        collected through this website. You can contact us at{" "}
        <ContactEmail />.
      </>,
    ],
  },
  {
    heading: "What we collect",
    paragraphs: [
      "Your email address, when you subscribe to the newsletter or join the Latticaxon waitlist.",
      "When you buy a product: your email address (given at checkout), the product you bought, the amount, and the status of the order. Your card details go to Stripe and are not seen or stored by us.",
      "Visit information for the website, collected through Vercel Web Analytics (combined statistics, no cookies) and Google Analytics (the pages you view, roughly where you are, your device and browser type, and how you arrived; it uses cookies or similar identifiers).",
    ],
  },
  {
    heading: "How we use it",
    paragraphs: [
      "To send you what you asked for (a purchase, the newsletter or waitlist news), to keep a record of orders so we can handle delivery problems and refunds, and to see how the site is used so we can improve it. We do not sell your personal information.",
    ],
  },
  {
    heading: "Who handles it for us",
    paragraphs: [
      "We use Stripe for payments, Resend to send purchase emails, MailerLite for the newsletter and waitlist, Supabase for our database, Google for Google Analytics, and Vercel for hosting and Vercel Web Analytics. They handle information on our behalf, and some of them may store it outside Australia.",
    ],
  },
  {
    heading: "Email",
    paragraphs: [
      "We only send the newsletter or vault news to people who asked for it, and every one of those emails has an unsubscribe link. Emails about a purchase you made are not marketing.",
    ],
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      "Order records are kept for as long as we need them for refunds, accounting and legal requirements. Newsletter and waitlist subscribers stay on the list until they unsubscribe.",
    ],
  },
  {
    heading: "Seeing or correcting your information",
    paragraphs: [
      <>
        Email <ContactEmail /> to ask what we hold about you, to correct it, or
        to have it removed where we are able to. If we cannot sort out a
        concern, you can complain to the Office of the Australian Information
        Commissioner at oaic.gov.au.
      </>,
    ],
  },
  {
    heading: "Changes to this page",
    paragraphs: [
      "We may update this page. The date at the top shows when it last changed.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy"
      intro="What we collect, why, and who helps us handle it."
      sections={sections}
    />
  );
}
