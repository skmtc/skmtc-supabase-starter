import { ContentBase } from 'jsr:@skmtc/core@^0.0.731'
import type { GenerateContext, ListObject } from 'jsr:@skmtc/core@^0.0.731'

type ResponseVoidArgs = {
  context: GenerateContext
  serviceName: string
  serviceArgs: ListObject<string>
}

export class ResponseVoid extends ContentBase {
  serviceName: string
  serviceArgs: ListObject<string>

  constructor({ context, serviceName, serviceArgs }: ResponseVoidArgs) {
    super({ context })

    this.serviceName = serviceName
    this.serviceArgs = serviceArgs
  }

  override toString(): string {
    return `    await ${this.serviceName}(${this.serviceArgs})()
      
    return c.body(null, 204)`
  }
}
