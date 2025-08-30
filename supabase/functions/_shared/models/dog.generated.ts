import { Breed, breed } from '@/_shared/models/breed.generated.ts'
import { z } from 'zod'

export type Dog = { id: string; name: string; breed: Breed }

export const dog = z.object({ id: z.string().min(1), name: z.string().min(1), breed: breed })
