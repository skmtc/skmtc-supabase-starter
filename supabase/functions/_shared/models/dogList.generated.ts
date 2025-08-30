import { Dog, dog } from '@/_shared/models/dog.generated.ts'
import { z } from 'zod'

export type DogList = Array<Dog>

export const dogList = z.array(dog)
