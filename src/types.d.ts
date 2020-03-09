declare const _: import('lodash').LoDashStatic

declare const enum CreepWork {
  Wait = 0,
  Harvest = 100,
  TransferEnergy = 201,
  Build = 202,
  Upgrade = 203,
  Repair = 204
}

declare const enum CreepJob {
  None = 0,
  Upgrader = 1,
  SpawnWorker = 2
}

interface CreepMemory {
  lastErr?: number
  target?: Id<unknown>
  work?: CreepWork
  job?: CreepJob
}

interface ObjectMemory {
  workers?: Id<Creep>[]
  maxWorkers?: number
}

interface Memory {
  object: Record<string, ObjectMemory>
}