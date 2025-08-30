import type { OasArray, OasOperation, OasRef, OasSchema } from 'jsr:@skmtc/core@^0.0.731'
import invariant from 'npm:tiny-invariant@^1.3.3'

type ListKeyAndItem = {
  key: string[]
  schema: OasSchema | OasRef<'schema'>
}

export const toListKeyAndItem = (operation: OasOperation): ListKeyAndItem => {
  const response = operation.toSuccessResponse()?.resolve().toSchema()?.resolve()

  invariant(response, 'Source of list key is undefined')

  if (response.type === 'array') {
    return {
      key: [],
      schema: response.items
    }
  }

  if (response.type === 'object') {
    const result = Object.entries(response.properties ?? {}).find(
      (entry): entry is [string, OasArray] => {
        return entry[1].type === 'array'
      }
    )

    invariant(result, 'Response object does not contain an array')

    const [key, schema] = result

    return {
      key: [key],
      schema: schema.items
    }
  }

  throw new Error('Expected to find a list key')
}

export const isListResponse = (operation: OasOperation) => {
  try {
    const { schema } = toListKeyAndItem(operation)

    return Boolean(schema)
  } catch (error) {
    return false
  }
}
