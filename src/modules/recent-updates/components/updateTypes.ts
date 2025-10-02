export interface UpdateItem {
  id: number;
  title: string;
  chapter: string;
  chapterTitle?: string;
  timeAgo: string;
  image: string;
  genre: string;
  isNew?: boolean;
}
