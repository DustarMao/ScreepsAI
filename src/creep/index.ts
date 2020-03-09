import {filterAvailableEnergy} from '../resources/energy'
import {findMaxBy} from '../utils/arrays'
import {getObjectMem} from '../utils/memory'

const workMethod: Record<CreepWork, (creep: Creep, targetObj: unknown) => number> = {
  [CreepWork.Harvest]: (creep, obj) => creep.harvest(obj as Source),
  [CreepWork.TransferEnergy]: (creep, obj) => creep.transfer(obj as Structure, RESOURCE_ENERGY),
  [CreepWork.Build]: (creep, obj) => creep.build(obj as ConstructionSite),
  [CreepWork.Upgrade]: (creep, obj) => creep.upgradeController(obj as StructureController),
  [CreepWork.Repair]: (creep, obj) => creep.repair(obj as Structure),
  [CreepWork.Wait]: (creep, obj) => {
    console.error('creep %s waiting but have target %s', creep.name, (obj as {id: Id<unknown>}).id)
    return OK
  }
}
function getCreepWorkStoreType(work: CreepWork = 0) {
  if (work >= 200) return -1
  if (work >= 100) return 1
  return 0
}

function continueWork(creep: Creep, work: CreepWork = 0, targetId?: Id<unknown>) {
  if (work === CreepWork.Wait) return
  if (targetId == null) return
  const target = Game.getObjectById(targetId)
  if (target == null) return

  const code = workMethod[work](creep, target)
  if (code === ERR_NOT_IN_RANGE) {
    creep.moveTo(target as {pos: RoomPosition})
  }
}

function newWorkWhenEmpty(creep: Creep) {
  const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
    filter: filterAvailableEnergy
  })
  if (source == null) {
    creep.say('no available energy')
    creep.memory.work = CreepWork.Wait
  } else {
    creep.memory.work = CreepWork.Harvest
    creep.memory.target = source.id
    getObjectMem(source.id, mem => ({
      ...mem,
      workers: [...mem.workers ?? [], creep.id]
    }))
  }
}

function getConstructionSitePriority(site: ConstructionSite) {
  switch (site.structureType) {
    case STRUCTURE_TOWER:
      return 1000
    case STRUCTURE_RAMPART:
    case STRUCTURE_WALL:
      return 500
    case STRUCTURE_SPAWN:
      return 100
    case STRUCTURE_EXTENSION:
      return 99
    case STRUCTURE_STORAGE:
      return 50
    case STRUCTURE_ROAD:
      return 1
    default:
      return 0
  }
}
function newWorkWhenFull(creep: Creep) {
  const sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
    filter: s => (getObjectMem(s.id).workers?.length ?? 0) < 1
  })
  if (sites.length > 0) {
    const target = findMaxBy(getConstructionSitePriority, sites)
    if (target != null) {
      creep.memory.target = target.id
      creep.memory.work = CreepWork.Build
      return
    }
  }

  const controller = creep.room.controller
  if (controller != null && (getObjectMem(controller.id).workers?.length ?? 0) < 1) {
    creep.memory.target = controller.id
    creep.memory.work = CreepWork.Upgrade
    return
  }

  const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS, {
    filter: s => s.store.getFreeCapacity('energy') > 0
  })
  if (spawn != null) {
    creep.memory.target = spawn.id
    creep.memory.work = CreepWork.TransferEnergy
    return
  }

  creep.memory.work = CreepWork.Wait
}

export function runCreep(creep: Creep) {
  const {memory, store} = creep

  const storeWorkType = getCreepWorkStoreType(memory.work)
  if (storeWorkType >= 0 && store.getFreeCapacity() === 0) {
    newWorkWhenFull(creep)
  }
  if (storeWorkType <= 0 && store.getUsedCapacity() === 0) {
    newWorkWhenEmpty(creep)
  }

  if (memory.work !== CreepWork.Wait) {
    continueWork(creep, memory.work, memory.target)
  }
}