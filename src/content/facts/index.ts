import { psychologyCategory, psychologyCollections } from './psychology';
import { relationshipsCategory, relationshipsCollections } from './relationships';
import { socialCategory, socialCollections } from './social';
import { crimeCategory, crimeCollections } from './crime';

export const factsCategories = [psychologyCategory, relationshipsCategory, socialCategory, crimeCategory];

export const allCollections = [
  ...psychologyCollections,
  ...relationshipsCollections,
  ...socialCollections,
  ...crimeCollections,
];

export function getCategoryById(id: string) {
  return factsCategories.find((c) => c.id === id);
}

export function getCollectionsForCategory(categoryId: string) {
  return allCollections.filter((c) => c.categoryId === categoryId);
}

export function getCollectionById(id: string) {
  return allCollections.find((c) => c.id === id);
}

export function getFactById(id: string) {
  for (const collection of allCollections) {
    const fact = collection.facts.find((f) => f.id === id);
    if (fact) return fact;
  }
  return null;
}
