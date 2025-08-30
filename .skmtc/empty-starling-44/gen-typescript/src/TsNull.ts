import type { GeneratorKey, GenerateContext } from 'jsr:@skmtc/core@^0.0.731'
import { ContentBase } from 'jsr:@skmtc/core@^0.0.731'

type ConstructorArgs = {
  context: GenerateContext
  generatorKey: GeneratorKey
}

export class TsNull extends ContentBase {
  type = 'null' as const

  constructor({ context, generatorKey }: ConstructorArgs) {
    super({ context, generatorKey })
  }

  override toString(): string {
    return 'null'
  }
}
