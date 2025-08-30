import type { Stringable } from 'jsr:@skmtc/core@^0.0.731'
import type { Modifiers } from 'jsr:@skmtc/core@^0.0.731'

export const withNullable = (value: Stringable, { nullable }: Modifiers): string => {
  return nullable ? `${value} | null` : `${value}`
}
