import { z } from 'astro/zod';

/** Explicit reading-time overrides must render as a positive whole minute. */
export const readingMinutesSchema = z.number().int().positive();
