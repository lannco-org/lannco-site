/**
 * Journal access helpers. Schema lives in src/content.config.ts; every route
 * reads through here so ordering, slugs and the date format cannot drift
 * between the index, the "All Articles" list, the article template and the
 * announcement bar.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'journal'>;

/** Newest first — the boards run the index in reverse chronological order. */
export async function getArticles(): Promise<Article[]> {
  const entries = await getCollection('journal');
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Board C's index shape: one large featured card plus a row of smaller ones.
 * Falls back to the newest article if no entry sets `featured`, so the layout
 * can never render an empty hero card.
 */
export async function getIndex(): Promise<{ featured: Article; rest: Article[] }> {
  const articles = await getArticles();
  const featured = articles.find((a) => a.data.featured) ?? articles[0];
  return { featured, rest: articles.filter((a) => a.id !== featured.id) };
}

export function articleHref(article: Article): string {
  return `/journal/${article.id}/`;
}

/**
 * "June 2024" — the format printed under every title on the boards. Forced to
 * UTC: the frontmatter dates parse as UTC midnight, so a local timezone west of
 * Greenwich would otherwise print the previous month.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
