import { capitalize, Identifier, toEndpointName, toOperationBase } from 'jsr:@skmtc/core@^0.0.756'
import { join } from 'jsr:@std/path@^1.0.6'
import { toFirstSegment } from './toFirstSegment.ts'

export const TanstackQueryBase = toOperationBase({
  id: '@skmtc/gen-tanstack-query-supabase-zod',

  toIdentifier(operation): Identifier {
    const name = `use${capitalize(toEndpointName(operation))}`

    return Identifier.createVariable(name)
  },

  toExportPath(operation): string {
    const firstSegment = toFirstSegment(operation)

    return join('@', 'services', `${firstSegment}.generated.ts`)
  },
})
