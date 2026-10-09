export interface FactReference {
  title: string;
  source: string;
  url?: string;
  year?: number;
}

export interface Fact {
  id: string;
  collectionId: string;
  number: number;
  title: string;
  readingTimeMinutes: number;
  evidenceLevel: number;
  summary: string;
  whyItHappens?: string;
  realWorldExample?: string;
  practicalUse?: string;
  relatedConcepts?: string[];
  references?: FactReference[];
  dateAdded: string;
}

export interface FactCollection {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  icon: string;
  colorClass: string;
  facts: Fact[];
}

export interface FactCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
}
