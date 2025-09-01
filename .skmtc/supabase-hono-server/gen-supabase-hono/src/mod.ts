import invariant from 'npm:tiny-invariant@^1.3.3'
import { SupabaseHono } from './SupabaseHono.ts'
import { toOperationEntry } from 'jsr:@skmtc/core@^0.0.756'

export const supabaseHonoEntry = toOperationEntry({
  id: '@skmtc/gen-supabase-hono',
  transform: ({ context, operation }) => {
    const app =
      context.findDefinition({
        name: 'app',
        exportPath: SupabaseHono.toExportPath(operation),
      }) ?? context.insertOperation(SupabaseHono, operation).definition

    invariant(app?.value instanceof SupabaseHono, 'app must be an instance of SupabaseHono')

    app.value.append(operation)
  },
})
