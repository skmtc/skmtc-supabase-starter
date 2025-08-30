import { z } from 'zod'
import { breed, Breed } from '@/models/breed.generated.ts'

export const dog = z.object({id: z.string().min(1), name: z.string().min(1), breed: breed});

export type Dog = {id: string, name: string, breed: Breed};
