import {getObjectMem, addWorkers} from "../utils/memory"
import {findMaxBy} from "../utils/arrays"

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
export function findBuildWork(creep: Creep) {
  const sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
    filter: s => (getObjectMem(s.id).workers?.length ?? 0) < 1,
  })
  if (sites.length > 0) {
    const target = findMaxBy(getConstructionSitePriority, sites)
    if (target != null) {
      creep.memory.target = target.id
      creep.memory.work = CreepWork.Build
      getObjectMem(target.id)
      return true
    }
  }
}

export function findUpgradeWork(creep: Creep) {
  const controller = creep.room.controller
  if (controller != null) {
    creep.memory.target = controller.id
    creep.memory.work = CreepWork.Upgrade
    getObjectMem(controller.id, addWorkers(creep))
    return true
  }
}

export function findSpawnWork(creep: Creep) {
  const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS, {
    filter: s => s.store.getFreeCapacity('energy') > 0,
  })
  if (spawn != null) {
    creep.memory.target = spawn.id
    creep.memory.work = CreepWork.TransferEnergy
    getObjectMem(spawn.id, addWorkers(creep))
    return true
  }
}