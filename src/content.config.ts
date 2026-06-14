import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const collections = {
	work: defineCollection({
		// Load Markdown files in the src/content/work directory.
		loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
			img: z.string(),
			img_alt: z.string().optional(),
		}),
	}),
	// Pages éditoriales dé-hardcodées (home, about). Miroir de `tina/config.ts` (collection `pages`).
	// Frontière repo (canon §3) : le contenu vit ici, la structure reste dans components/layouts.
	pages: defineCollection({
		loader: glob({ base: './src/content/pages', pattern: '*.md' }),
		schema: z.object({
			title: z.string().optional(),
			description: z.string().optional(),
			hero: z.object({
				title: z.string(),
				tagline: z.string().optional(),
				align: z.enum(['start', 'center']).optional(),
				image: z.string().optional(),
				imageAlt: z.string().optional(),
				imageWidth: z.number().optional(),
				imageHeight: z.number().optional(),
				roles: z
					.array(z.object({ icon: z.string(), label: z.string() }))
					.optional(),
			}),
			skills: z
				.array(
					z.object({
						icon: z.string(),
						title: z.string(),
						description: z.string(),
					}),
				)
				.optional(),
			selectedWork: z
				.object({ title: z.string(), text: z.string().optional() })
				.optional(),
			mentions: z
				.object({
					title: z.string(),
					text: z.string().optional(),
					brands: z.array(z.string()).optional(),
				})
				.optional(),
			sections: z
				.array(
					z.object({
						title: z.string(),
						body: z.array(z.string()).optional(),
					}),
				)
				.optional(),
			contact: z
				.object({
					title: z.string(),
					buttonLabel: z.string(),
					href: z.string(),
				})
				.optional(),
		}),
	}),
};
