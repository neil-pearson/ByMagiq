import { LEGAL_READY } from "@/lib/legal";

/**
 * The one shared FAQ list (bm-geo-c). The /faq page and its FAQPage markup
 * are both built from this, so the markup always matches the visible text.
 *
 * Wording rules (bm-geo.md): every answer is true at launch, and none states a
 * count, a price or a list of what is for sale, so the answers stay true as
 * products are added. Neil approved this wording on 2026-11-01. Re-check an
 * answer whenever the thing it describes changes.
 */
export type FaqItem = {
  question: string;
  /** Plain text: this exact string is also used in the FAQPage markup. */
  answer: string;
  /** Optional link shown under the answer on the page (not in the markup). */
  link?: { href: string; label: string };
};

type FaqEntry = FaqItem & {
  /** Only listed once the Terms page is live (lib/legal.ts). */
  requiresLegal?: boolean;
};

const ENTRIES: FaqEntry[] = [
  {
    question: "What is ByMagiq?",
    answer:
      "ByMagiq builds tools for AI that keeps its memory, so you don't have to re-explain your projects every time you start a new conversation. It makes Latticaxon, a shop of playbooks and add-ons, and a companion site called Scrhoz.",
  },
  {
    question: "What is Latticaxon?",
    answer:
      "A personal knowledge and project system that runs on Obsidian, with Claude as the AI layer. You capture notes, decisions and ideas in one inbox, Claude helps sort them into projects, and the links between them let Claude pick up where you left off.",
    link: { href: "/latticaxon", label: "About Latticaxon" },
  },
  {
    question: "Is Latticaxon free?",
    answer:
      "The base vault is free. Modules and playbooks that extend it are sold individually, and some are free.",
  },
  {
    question: "What do I need to use it?",
    answer:
      "It runs on Obsidian, a local plain-text note app, and uses Claude as the AI layer. Full requirements will be listed on the Latticaxon page when it is released.",
  },
  {
    question: "Where is my data stored?",
    answer:
      "In your own Obsidian vault, as plain-text files you can read without us. When you ask Claude to work with your notes, what you share with it is handled under Claude's own terms.",
  },
  {
    question: "What is a playbook?",
    answer:
      "A chain of prompts that runs in any AI. Each step builds on the one before, and the chain ends in one finished deliverable.",
    link: { href: "/shop/playbooks", label: "Browse playbooks" },
  },
  {
    question: "How is ByMagiq different from Scrhoz?",
    answer:
      "Scrhoz is our companion site for simple prompts, sheets, systems and books. ByMagiq is for Latticaxon and the playbooks and add-ons built around it.",
    link: { href: "/scrhoz", label: "About Scrhoz" },
  },
  {
    question: "How are products delivered?",
    answer:
      "Digitally. After you buy, the product is sent to the email address you give at checkout, either as text in the email or as a download link. Each product page says what you receive.",
  },
  {
    question: "What if a product doesn't work for me?",
    answer:
      "Australian Consumer Law protects you if a product is faulty or not as described, and if you change your mind you can ask for a refund within 14 days. The details are in the terms of sale.",
    link: { href: "/terms", label: "Terms of sale and refunds" },
    requiresLegal: true,
  },
];

export const FAQ: FaqItem[] = ENTRIES.filter(
  (e) => !e.requiresLegal || LEGAL_READY
).map(({ question, answer, link }) => ({ question, answer, link }));
