export function getObjectMem(id: Id<unknown>, deal?: (mem: ObjectMemory) => ObjectMemory): ObjectMemory {
  if (Memory.object == null) {
    Memory.object = {}
  }
  if (Memory.object[id] == null) {
    Memory.object[id] = {}
  }
  if (deal != null) {
    Memory.object[id] = deal(Memory.object[id])
  }
  return Memory.object[id]
}

export function addWorkers(creep: Creep) {
  return (mem: ObjectMemory) => {
    return {
      ...mem, 
      workers: [...mem.workers ?? [], creep.id]
    }
  }
}

export function delWorkers(creep: Creep) {
  return (mem: ObjectMemory) => {
    return {
      ...mem,
      workers: mem.workers?.filter(id => id !== creep.id)
    }
  }
}