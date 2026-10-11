import { z } from 'zod'

export const env = z.object({
    MONGO_DB_URI: z.coerce.string(),
    PORT: z.coerce.number().min(1).max(65550).default(3001),
    NODE_ENV: z.coerce.string()
}).parse(process.env)