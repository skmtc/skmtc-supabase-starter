import type { OperationInsertableArgs, Stringable, ListArray } from 'jsr:@skmtc/core@^0.0.756'
import { List, capitalize, FunctionParameter } from 'jsr:@skmtc/core@^0.0.756'
import { PaginatedQueryFn } from './PaginatedQueryFn.ts'
import { TanstackQueryBase } from './base.ts'
import { TsInsertable } from '@skmtc/gen-typescript'

export class PaginatedQueryEndpoint extends TanstackQueryBase {
  queryFn: PaginatedQueryFn
  queryTags: ListArray<Stringable>
  parameter: FunctionParameter
  constructor({ context, operation, settings }: OperationInsertableArgs) {
    super({ context, operation, settings })

    this.queryFn = new PaginatedQueryFn({ context, operation, settings })

    const operationTags: Stringable[] = operation.tags?.map(tag => `'${tag}'`) ?? []

    const typeDefinition = this.insertNormalizedModel(TsInsertable, {
      schema: operation.toParametersObject(['query', 'path']),
      fallbackName: `${capitalize(settings.identifier.name)}Args`,
    })

    this.parameter = new FunctionParameter({
      typeDefinition,
      destructure: true,
      required: true,
      skipEmpty: true,
    })

    this.queryTags = List.toArray(operationTags.concat(this.parameter.toPropertyList().values))

    this.register({
      imports: {
        '@tanstack/react-query': ['useQuery', 'keepPreviousData'],
      },
    })
  }

  override toString(): string {
    return `(${this.parameter}) => {      
      const result = useQuery({
        queryKey: ${this.queryTags},
        queryFn: ${this.queryFn},
        placeholderData: keepPreviousData
      })

      return result
    }`
  }
}
