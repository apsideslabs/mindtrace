export type CategoryId = string;
export type TopicId = string;

export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  iconName: string;
}

export interface TopicSection {
  title: string;
  content: string | string[];
}

export interface Topic {
  id: TopicId;
  slug: string;
  title: string;
  category: CategoryId;
  description: string;
  shortDescription?: string;
  readTime: number;
  estimatedReadTime?: number;
  difficulty?: string;
  tags?: string[];
  references?: string[];
  relatedTopics: TopicId[];
  sections: TopicSection[];
}

export interface UserStats {
  topicsRead: TopicId[];
  readingTimeMinutes: number;
  bookmarkedTopics: TopicId[];
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
}
