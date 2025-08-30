import { toModelEntry } from 'jsr:@skmtc/core@^0.0.731'
import { TsInsertable } from './TsInsertable.ts'

export const typescriptEntry = toModelEntry({
  id: '@skmtc/gen-typescript',
  transform({ context, refName }) {
    context.insertModel(TsInsertable, refName)
  }
})
