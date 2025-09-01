import type { Stringable, OperationInsertableArgs, ListArray } from 'jsr:@skmtc/core@^0.0.756'
import { List, capitalize, FunctionParameter } from 'jsr:@skmtc/core@^0.0.756'
import { TanstackQueryBase } from './base.ts'
import { QueryFn } from './QueryFn.ts'
import { TsInsertable } from '@skmtc/gen-typescript'

export class QueryEndpoint extends TanstackQueryBase {
  queryFn: QueryFn
  queryTags: ListArray<Stringable>
  parameter: FunctionParameter
  constructor({ context, operation, settings }: OperationInsertableArgs) {
    super({ context, operation, settings })

    this.queryFn = new QueryFn({ context, operation, settings })

    const queryAndPathParams = operation.toParams(['query', 'path']).map(({ name }) => name)

    const operationTags: Stringable[] = operation.tags?.map(tag => `'${tag}'`) ?? []

    this.queryTags = List.toArray(operationTags.concat(queryAndPathParams))

    const typeDefinition = this.insertNormalizedModel(TsInsertable, {
      schema: operation.toParametersObject(),
      fallbackName: `${capitalize(settings.identifier.name)}Args`,
    })

    this.parameter = new FunctionParameter({
      typeDefinition,
      destructure: true,
      required: true,
      skipEmpty: true,
    })

    this.register({
      imports: {
        '@tanstack/react-query': ['useQuery'],
      },
    })
  }

  override toString(): string {
    return `(${this.parameter}) => {
      const result = useQuery({
        queryKey: ${this.queryTags},
        queryFn: ${this.queryFn}
      })

      return result
    }`
  }
}
