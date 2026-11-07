import { z } from 'astro/zod';

/** Required editorial copy must contain visible text after trimming. */
export const requiredEditorialText = (max: number) => z.string().trim().min(1).max(max);
