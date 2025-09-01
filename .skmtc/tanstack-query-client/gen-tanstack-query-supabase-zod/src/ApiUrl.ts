import { ContentBase, List, toPathTemplate } from 'jsr:@skmtc/core@^0.0.756'
import type { OasOperation, GenerateContext, ListObject } from 'jsr:@skmtc/core@^0.0.756'

type ApiUrlArgs = {
  context: GenerateContext
  operation: OasOperation
  destinationPath: string
}

export class ApiUrl extends ContentBase {
  path: string
  queryParamArgs: ListObject<string>
  hasQueryParams: boolean
  constructor({ context, operation, destinationPath }: ApiUrlArgs) {
    super({ context })

    const queryParams = operation.toParams(['query'])

    this.path = toPathTemplate(operation.path)

    this.queryParamArgs = List.toObject(queryParams.map(({ name }) => name))

    this.hasQueryParams = queryParams.length > 0

    if (this.hasQueryParams) {
      context.register({
        imports: { '@/lib/toSearch': ['toSearch'] },
        destinationPath,
      })
    }
  }

  override toString(): string {
    return this.hasQueryParams
      ? `\`${this.path}\${toSearch(${this.queryParamArgs})}\``
      : `\`${this.path}\``
  }
}
