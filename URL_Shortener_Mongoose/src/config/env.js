import {z} from 'zod'

export const env = z.object({
    PORT: z.coerce.number().default(3001),
    MONGO_DB_URI: z.coerce.string()
}).parse(process.env)