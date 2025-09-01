import { Identifier, toOperationBase } from 'jsr:@skmtc/core@^0.0.756'
import { join } from 'jsr:@std/path@^1.0.6'
import { toFirstSegment } from './toFirstSegment.ts'

export const SupabaseHonoBase = toOperationBase({
  id: '@skmtc/gen-supabase-hono',

  toIdentifier(): Identifier {
    return Identifier.createVariable('app')
  },

  toExportPath(operation): string {
    const firstSegment = toFirstSegment(operation)

    return join('@', `${firstSegment}`, `api.generated.ts`)
  },
})
