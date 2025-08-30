import { z } from 'zod'

export type Breed = 'dachshund' | 'dalmatian' | 'poodle'

export const breed = z.enum(['dachshund', 'dalmatian', 'poodle'])
