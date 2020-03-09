declare const _: import('lodash').LoDashStatic

declare const enum CreepWork {
  Wait = 0,
  Harvest = 100,
  TransferEnergy = 201,
  Build = 202,
  Upgrade = 203,
  Repair = 204
}

interface CreepMemory {
  target?: Id<unknown>
  work?: CreepWork
}

interface ObjectMemory {
  workers?: Id<Creep>[]
  maxWorkers?: number
}

interface Memory {
  object: Record<string, ObjectMemory>
}