import { ModelDriver, toModelGeneratorKey, ContentBase } from 'jsr:@skmtc/core@^0.0.731'
import type { GenerateContext, Modifiers, RefName } from 'jsr:@skmtc/core@^0.0.731'
import { applyModifiers } from './applyModifiers.ts'
import { TsInsertable } from './TsInsertable.ts'
import { typescriptEntry } from './mod.ts'

type TsRefConstructorProps = {
  context: GenerateContext
  destinationPath: string
  modifiers: Modifiers
  refName: RefName
  rootRef?: RefName
}

export class TsRef extends ContentBase {
  type = 'ref' as const
  name: string
  modifiers: Modifiers
  terminal: boolean
  constructor({ context, refName, modifiers, destinationPath, rootRef }: TsRefConstructorProps) {
    super({
      context,
      generatorKey: toModelGeneratorKey({ generatorId: typescriptEntry.id, refName })
    })

    if (context.modelDepth[typescriptEntry.id] > 0) {
      const settings = context.toModelContentSettings({
        refName,
        insertable: TsInsertable
      })

      this.name = settings.identifier.name
      this.modifiers = modifiers
      this.terminal = true
    } else {
      const tsDriver = new ModelDriver({
        context,
        refName,
        generation: 'force',
        destinationPath,
        insertable: TsInsertable,
        rootRef
      })

      this.name = tsDriver.settings.identifier.name
      this.modifiers = modifiers
      this.terminal = false
    }
  }

  override toString(): string {
    return applyModifiers(this.name, this.modifiers)
  }
}
