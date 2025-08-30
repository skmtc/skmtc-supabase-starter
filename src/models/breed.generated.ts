import { z } from 'zod'

export const breed = z.enum(['dachshund', 'dalmatian', 'poodle']);

export type Breed = 'dachshund' | 'dalmatian' | 'poodle';
