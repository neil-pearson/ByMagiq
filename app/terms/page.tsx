import type { Metadata } from "next";
import { LEGAL, LEGAL_READY, PLACEHOLDER } from "@/lib/legal";
import {
  ContactEmail,
  LegalDoc,
  SellerName,
  type LegalSection,
} from "@/components/LegalDoc";

export const metadata: Metadata = {
  title: "Terms of sale and refunds — ByMagiq",
  description:
    "The terms for buying from ByMagiq: what you get, how it is delivered, how you may use it, and how refunds work.",
  alternates: { canonical: "/terms" },
  // A draft until the seller details are confirmed (lib/legal.ts).
  robots: LEGAL_READY ? undefined : { index: false, follow: false },
};

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      <>
        These terms apply to products you buy or download from this website.
        The seller is <SellerName />
        {LEGAL.abn ? ` (ABN ${LEGAL.abn})` : ""}. You can contact us at{" "}
        <ContactEmail />.
      </>,
    ],
  },
  {
    heading: "What you are buying",
    paragraphs: [
      "We sell digital products: playbooks, add-ons for the Latticaxon vault, and similar prompts and files. Each product page says what the product is and what you receive. Products marked as coming with the vault are not for sale yet.",
    ],
  },
  {
    heading: "Prices and payment",
    paragraphs: [
      "Prices are in Australian dollars (AUD). Payment is taken by Stripe at checkout. We do not see or store your card details.",
    ],
  },
  {
    heading: "Delivery",
    paragraphs: [
      "After payment we send the product to the email address you give at checkout, either as text in the email or as a download link. If it has not arrived after a short time, check your spam folder, then email us and we will send it again.",
    ],
  },
  {
    heading: "How you may use it",
    paragraphs: [
      "When you buy a product you get a personal licence to use it for your own work, with any AI tool you choose. Please do not resell it, share it with others or publish it. Free products are covered by the same terms.",
    ],
  },
  {
    heading: "Results",
    paragraphs: [
      "Our products are instructions and files that you use with AI tools. AI output varies, so we cannot promise a particular result, and you are responsible for checking anything you rely on.",
    ],
  },
  {
    heading: "Refunds and your rights under Australian law",
    paragraphs: [
      "Our products come with consumer guarantees under the Australian Consumer Law that cannot be excluded. If a product is faulty, does not match its description or does not do what we said it would, you are entitled to a remedy, such as a replacement or a refund. These rights apply for a reasonable time after you buy, not only for the first few days.",
      "On top of that, if you simply change your mind, email us within 14 days of buying and we will refund the price you paid, to your original payment method.",
      "Nothing in these terms limits your rights under the Australian Consumer Law.",
    ],
  },
  {
    heading: "Changes to these terms",
    paragraphs: [
      "We may update these terms. The version on this page, with the date shown above, applies to purchases made on or after that date.",
    ],
  },
  {
    heading: "Governing law",
    paragraphs: [
      `These terms are governed by the laws of ${
        LEGAL.governingState ?? PLACEHOLDER.governingState
      }, Australia.`,
    ],
  },
  {
    heading: "Contact",
    paragraphs: [
      <>
        Questions, delivery problems and refund requests: <ContactEmail />.
      </>,
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of sale and refunds"
      intro="Plain-language terms for buying from ByMagiq. They are short on purpose."
      sections={sections}
    />
  );
}
