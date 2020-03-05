declare const _: import('lodash').LoDashStatic

declare const enum CreepRole {
  Harvester = 0,
  Builder = 1,
  Upgrader = 2,
}
interface CreepMemory {
  role?: CreepRole
  building?: boolean
  upgrading?: boolean
  target?: Id<unknown>
}
