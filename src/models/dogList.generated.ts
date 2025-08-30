import { dog, Dog } from '@/models/dog.generated.ts'
import { z } from 'zod'

export const dogList = z.array(dog);

export type DogList = Array<Dog>;
