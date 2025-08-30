import { capitalize, ContentBase, OasVoid } from 'jsr:@skmtc/core@^0.0.731'
import type { GenerateContext, OasSchema, OasRef, ListObject } from 'jsr:@skmtc/core@^0.0.731'
import { TsInsertable } from 'jsr:@skmtc/gen-typescript@^0.0.31'

type ResponseArgs = {
  context: GenerateContext
  responseSchema: OasSchema | OasRef<'schema'> | undefined
  serviceName: string
  serviceArgs: ListObject<string>
  destinationPath: string
}

export class Response extends ContentBase {
  serviceName: string
  serviceArgs: ListObject<string>
  tsResponseName: string

  constructor({
    context,
    responseSchema,
    serviceName,
    serviceArgs,
    destinationPath,
  }: ResponseArgs) {
    super({ context })

    const insertedResponse = context.insertNormalisedModel(TsInsertable, {
      schema: responseSchema ?? OasVoid.empty(),
      fallbackName: capitalize(`${serviceName}Response`),
      destinationPath,
    })

    this.serviceName = serviceName
    this.serviceArgs = serviceArgs
    this.tsResponseName = insertedResponse.identifier.name
  }

  override toString(): string {
    return `const res: ${this.tsResponseName} = await ${this.serviceName}(${this.serviceArgs})()

    if(!res){
      return c.body(null, 404)
    }

    return c.json(res)
`
  }
}
