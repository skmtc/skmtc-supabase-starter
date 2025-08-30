import type { OasOperation } from 'jsr:@skmtc/core@^0.0.731'

export const toFirstSegment = ({ path }: OasOperation) => path.split('/').find(Boolean)
