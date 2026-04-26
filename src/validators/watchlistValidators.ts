import {z} from 'zod'

export const addToWatchlistSchema = z.object({
    movieId: z.string().cuid(),
    status: z.enum(["PLANNED","WATCHING","COMPLETED","DROPPED"]),
    rating: z.coerce.number().int().min(1).max(10).optional(),
    notes: z.string().optional()
})