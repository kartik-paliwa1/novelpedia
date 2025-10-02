export interface Highlight {
  image: string;            // URL or path to the cover image
  title: string;            // Display title
  tags: string[];           // Array of tag names
  likeRate: number;         // 0–1 (e.g., 0.87) or 0–100 if you prefer percentage
  chapterCount: number;     // Total number of chapters
  description: string;      // Short summary/description
}