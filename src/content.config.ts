import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    room: z.string(),
    category: z.string(),
    type: z.enum(['educational', 'informational', 'product_guide', 'product_spotlight', 'pillar']),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    description: z.string().max(160),
    author: z.string(),
    dataFile: z.string().optional(),
    affiliateDisclosure: z.boolean().default(false),
    linkedArticles: z.array(z.object({
      slug: z.string(),
      title: z.string(),
    })).optional().default([]),
    crossRoomThread: z.object({
      room: z.string(),
      category: z.string(),
      slug: z.string(),
      hook: z.string(),
    }).optional(),
  }),
});

export const collections = { articles };
