import { glob } from 'astro/loaders';
import { defineCollection, z, type ImageFunction } from 'astro:content';
import { parseContentDate } from './utils/date-utils';

const imageSchema = (image: ImageFunction) =>
    z.object({
        src: image(),
        alt: z.string().optional()
    });

const seoSchema = (image: ImageFunction) =>
    z.object({
        title: z.string().min(5).max(120).optional(),
        description: z.string().min(15).max(160).optional(),
        image: imageSchema(image).optional(),
        pageType: z.enum(['website', 'article']).default('website')
    });

const contentDateSchema = z.union([z.string(), z.date()]).transform((value, ctx) => {
    try {
        return parseContentDate(value);
    } catch (error) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: error instanceof Error ? error.message : 'Invalid date.'
        });

        return z.NEVER;
    }
});

const blog = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            excerpt: z.string().optional(),
            publishDate: contentDateSchema,
            updatedDate: contentDateSchema.optional(),
            is_draft: z.boolean().default(false),
            isFeatured: z.boolean().default(false),
            tags: z.array(z.string()).default([]),
            seo: seoSchema(image).optional()
        })
});

const pages = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            seo: seoSchema(image).optional()
        })
});

const projects = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string().optional(),
            publishDate: contentDateSchema,
            isFeatured: z.boolean().default(false),
            seo: seoSchema(image).optional()
        })
});

export const collections = { blog, pages, projects };
