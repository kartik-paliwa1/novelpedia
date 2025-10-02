import type { LucideIcon } from "lucide-react"
import { BookOpen, PenSquare, Coins, ShieldCheck, Users } from "lucide-react"

export type FAQCategory = "getting-started" | "writing-tools" | "monetization" | "account" | "community"

export interface FAQ {
  id: string
  question: string
  answer: string
  category: FAQCategory
  tags?: string[]
}

export const faqCategories: Record<FAQCategory, { title: string; description: string; icon: LucideIcon }> = {
  "getting-started": {
    title: "Getting Started",
    description: "Set up your author account and learn the basics of Inkosei.",
  icon: BookOpen,
  },
  "writing-tools": {
    title: "Writing Tools",
    description: "Discover how to use the writing workspace and editor features.",
    icon: PenSquare,
  },
  monetization: {
    title: "Monetization",
    description: "Understand payouts, banking details, and monetization options.",
    icon: Coins,
  },
  account: {
    title: "Account & Security",
    description: "Manage your login, privacy, and notification preferences.",
    icon: ShieldCheck,
  },
  community: {
    title: "Community",
    description: "Engage with readers and collaborate with other authors.",
  icon: Users,
  },
}

export const faqData: FAQ[] = [
  {
    id: "faq-getting-started-1",
    question: "How do I set up my Inkosei author account?",
    answer:
      "Create an account using your email address, then complete the onboarding checklist inside the dashboard overview to configure your pen name, profile photo, and preferred genres.",
    category: "getting-started",
    tags: ["account", "setup", "profile"],
  },
  {
    id: "faq-getting-started-2",
    question: "Where can I find the dashboard analytics?",
    answer:
      "Visit the Overview page after logging in. The stats grid shows your latest reader activity, chapter performance, and promotional opportunities tailored to your novels.",
    category: "getting-started",
    tags: ["analytics", "overview"],
  },
  {
    id: "faq-writing-tools-1",
    question: "Does the editor support collaborative writing?",
    answer:
      "Yes. Invite collaborators from the Workspace page. Each collaborator can edit chapters in real time, leave inline comments, and view version history.",
    category: "writing-tools",
    tags: ["editor", "collaboration", "workspace"],
  },
  {
    id: "faq-writing-tools-2",
    question: "Can I import existing drafts?",
    answer:
      "Use the Import Draft button inside the Workspace tab to upload Markdown, DOCX, or plain text files. Inkosei automatically formats the content and keeps your original structure.",
    category: "writing-tools",
    tags: ["import", "draft", "workspace"],
  },
  {
    id: "faq-monetization-1",
    question: "How do payouts work on Inkosei?",
    answer:
      "Add your banking information in Settings → Banking. Royalties are processed on the 1st of every month, and you can track upcoming payouts from the same section.",
    category: "monetization",
    tags: ["payouts", "banking", "royalties"],
  },
  {
    id: "faq-monetization-2",
    question: "Can I offer subscription tiers to readers?",
    answer:
      "Yes. Enable monetization in the Promotions section of your novel and configure tier perks. Readers can then subscribe to support your work with recurring contributions.",
    category: "monetization",
    tags: ["subscriptions", "tiers", "readers"],
  },
  {
    id: "faq-account-1",
    question: "How can I enable two-factor authentication?",
    answer:
      "Open Settings → Security and toggle Two-Factor Authentication. You can choose between authenticator apps or email-based verification codes.",
    category: "account",
    tags: ["security", "2fa"],
  },
  {
    id: "faq-account-2",
    question: "Where do I manage notification preferences?",
    answer:
      "Notification preferences are available under Settings → Notifications. Choose which updates you’d like to receive via email or in-app alerts.",
    category: "account",
    tags: ["notifications", "preferences"],
  },
  {
    id: "faq-community-1",
    question: "How do I feature my work in the community spotlight?",
    answer:
      "Participate in weekly community challenges. The Community page lists the current spotlight theme and submission guidelines for authors.",
    category: "community",
    tags: ["community", "spotlight", "challenges"],
  },
  {
    id: "faq-community-2",
    question: "What support channels are available besides Discord?",
    answer:
      "You can open a support ticket from Help & Support or browse the community forums for peer-to-peer troubleshooting. Priority responses are provided through Discord.",
    category: "community",
    tags: ["support", "discord", "forums"],
  },
]

export const searchFAQs = (query: string): FAQ[] => {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return faqData

  return faqData.filter((faq) => {
    const haystack = [faq.question, faq.answer, faq.tags?.join(" ") ?? ""].join(" ").toLowerCase()
    return haystack.includes(normalized)
  })
}

export const getFAQsByCategory = (category: FAQCategory): FAQ[] =>
  faqData.filter((faq) => faq.category === category)
