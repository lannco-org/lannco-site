import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Journal articles. Index metadata is verbatim from docs/COPY.md; the bodies are
 * still outstanding (COPY.md open question 2), so an entry may carry
 * `bodyPending: true` and an empty body — the article template renders a
 * "being finalised" line rather than invented copy, same as the capability
 * pillars do.
 *
 * The file name is the slug: src/content/journal/<slug>.md -> /journal/<slug>/.
 */
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    /** The three small-caps labels the boards print above a card title. */
    category: z.enum(['Insights', 'Perspectives', 'Outlook']),
    /** Real date so the index can sort; printed as "June 2024". */
    date: z.coerce.date(),
    /** Exactly one entry should set this — it takes the large index card. */
    featured: z.boolean().default(false),
    /** docs/ASSETS.md #11 reference for the thumbnail slot. */
    asset: z.string(),
    /** True until the client supplies the body copy. */
    bodyPending: z.boolean().default(false),
  }),
});

export const collections = { journal };
