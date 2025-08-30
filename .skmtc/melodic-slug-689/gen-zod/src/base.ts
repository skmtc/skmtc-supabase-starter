import {
  decapitalize,
  Identifier,
  toModelBase,
  type RefName,
  camelCase
} from 'jsr:@skmtc/core@^0.0.731'
import { join } from 'jsr:@std/path@^1.0.6'

export const ZodBase = toModelBase({
  id: '@skmtc/gen-zod',

  toIdentifier(refName: RefName): Identifier {
    const name = decapitalize(camelCase(refName))

    return Identifier.createVariable(name)
  },

  toExportPath(refName: RefName): string {
    const { name } = this.toIdentifier(refName)

    return join('@', '_shared', 'models', `${decapitalize(name)}.generated.ts`)
  }
})
