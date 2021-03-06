import {filterAvailableEnergy} from '../resources/energy'
import {addWorkers, delWorkers, getObjectMem} from '../utils/memory'
import {findBuildWork, findSpawnWork, findUpgradeWork} from './works'

const workMethod: Record<
  CreepWork,
  (creep: Creep, targetObj: unknown) => number
> = {
  [CreepWork.Harvest]: (creep, obj) => creep.harvest(obj as Source),
  [CreepWork.TransferEnergy]: (creep, obj) =>
    creep.transfer(obj as Structure, RESOURCE_ENERGY),
  [CreepWork.Build]: (creep, obj) => creep.build(obj as ConstructionSite),
  [CreepWork.Upgrade]: (creep, obj) =>
    creep.upgradeController(obj as StructureController),
  [CreepWork.Repair]: (creep, obj) => creep.repair(obj as Structure),
  [CreepWork.Wait]: (creep, obj) => {
    console.error(
      'creep %s waiting but have target %s',
      creep.name,
      (obj as {id: Id<unknown>}).id
    )
    return OK
  },
}
function getCreepWorkStoreType(work: CreepWork = 0) {
  if (work >= 200) return -1
  if (work >= 100) return 1
  return 0
}

function continueWork(
  creep: Creep,
  work: CreepWork = 0,
  targetId?: Id<unknown>
) {
  if (work === CreepWork.Wait) return
  if (targetId == null) return
  const target = Game.getObjectById(targetId)
  if (target == null) return

  const code = workMethod[work](creep, target)
  if (code === ERR_NOT_IN_RANGE) {
    creep.moveTo(target as {pos: RoomPosition})
  } else if (code !== OK) {
    creep.memory.work = CreepWork.Wait
    creep.memory.target = undefined
    getObjectMem(targetId, delWorkers(creep))
    console.log('creep', creep.name, 'unhandled error:', code)
  }
}

function newWorkWhenEmpty(creep: Creep) {
  const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
    filter: filterAvailableEnergy,
  })
  if (source == null) {
    creep.say('no available energy')
    creep.memory.work = CreepWork.Wait
  } else {
    creep.memory.work = CreepWork.Harvest
    creep.memory.target = source.id
    getObjectMem(source.id, addWorkers(creep))
  }
}

function newWorkWhenFull(creep: Creep) {
  const workList: ((creep: Creep) => boolean | void)[] = []
  switch (creep.memory.job) {
    case CreepJob.Upgrader:
      workList.push(findUpgradeWork, findBuildWork, findSpawnWork)
      break
    case CreepJob.SpawnWorker:
      workList.push(findSpawnWork, findBuildWork, findUpgradeWork)
      break
    default:
      workList.push(findBuildWork, findSpawnWork, findUpgradeWork)
  }

  for (const findWork of workList) {
    if (findWork(creep)) break
  }

  creep.memory.work = CreepWork.Wait
}

export function runCreep(creep: Creep) {
  const {memory, store} = creep

  const storeWorkType = getCreepWorkStoreType(memory.work)
  if (storeWorkType > 0 && store.getFreeCapacity() === 0) {
    if (memory.target) {
      getObjectMem(memory.target, delWorkers(creep))
    }
    newWorkWhenFull(creep)
  }
  if (storeWorkType < 0 && store.getUsedCapacity() === 0) {
    if (memory.target) {
      getObjectMem(memory.target, delWorkers(creep))
    }
    newWorkWhenEmpty(creep)
  }
  if (storeWorkType === 0) {
    if (store.getUsedCapacity() > store.getFreeCapacity()) {
      newWorkWhenFull(creep)
    } else {
      newWorkWhenEmpty(creep)
    }
  }

  if (memory.work !== CreepWork.Wait) {
    continueWork(creep, memory.work, memory.target)
  }
}
