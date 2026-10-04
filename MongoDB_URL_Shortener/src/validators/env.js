import { z } from 'zod'

export const env = z.object({
    PORT: z.coerce.number(),
    MONGO_DB_NAME: z.string(),
    MONGO_DB_URI: z.string()
}).parse(process.env)