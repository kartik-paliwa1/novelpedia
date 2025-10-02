export const DISCORD_CONFIG = {
  inviteUrl: "https://discord.gg/DmTnZs9K",
  joinText: "Join Our Discord Community",
  description:
    "Get instant help from our community of authors, share your work, and stay updated with the latest features.",
  features: ["24/7 Community", "Writing Tips", "Beta Features", "Ticketing Support"],
}

export const openDiscord = () => {
  if (typeof window !== "undefined") {
    window.open(DISCORD_CONFIG.inviteUrl, "_blank", "noopener,noreferrer")
  }
}
