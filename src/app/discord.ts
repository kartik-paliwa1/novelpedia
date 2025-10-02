export const DISCORD_CONFIG = {
  // Replace with your actual Discord server invite link
  inviteUrl: 'https://discord.gg/DmTnZs9K',
  
  // Display text for Discord buttons
  joinText: 'Join Our Discord Community',
  
  // Description text
  description: 'Get instant help from our community of authors, share your work, and stay updated with the latest features.',
  
  // Community features/badges
  features: [
    '24/7 Community',
    'Writing Tips',
    'Beta Features'
  ]
}

// Helper function to open Discord in a new tab
export const openDiscord = () => {
  window.open(DISCORD_CONFIG.inviteUrl, '_blank')
}