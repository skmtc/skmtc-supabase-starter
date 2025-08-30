import { toPathTemplate, ContentBase } from 'jsr:@skmtc/core@^0.0.731'
import type { OperationInsertableArgs, OasOperation } from 'jsr:@skmtc/core@^0.0.731'

export class SearchParams extends ContentBase {
  operation: OasOperation
  constructor({ context, operation }: OperationInsertableArgs) {
    super({ context })

    this.operation = operation

    const hasSearchParams = operation.toParams(['query']).length > 0
  }

  override toString(): string {
    const { path } = this.operation

    return `const url = new URL(\`${toPathTemplate(path)}\`)

      Object.entries({ name }).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, value)
        }
      })`
  }
}
