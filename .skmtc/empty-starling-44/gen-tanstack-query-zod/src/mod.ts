import { TanstackQuery } from './TanstackQuery.ts'
import { toOperationEntry } from 'jsr:@skmtc/core@^0.0.731'

export const tanstackQueryEntry = toOperationEntry({
  id: '@skmtc/gen-tanstack-query-zod',
  transform: ({ context, operation }) => {
    context.insertOperation(TanstackQuery, operation)
  },
  isSupported({ operation }) {
    if (['get', 'delete'].includes(operation.method)) {
      return true
    }

    if (['post', 'put', 'patch'].includes(operation.method)) {
      return Boolean(operation.toRequestBody(({ schema }) => schema))
    }

    return false
  }
})
