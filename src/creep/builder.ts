import {findMaxBy} from "../utils/arrays"

export function getBuildPriority(s: ConstructionSite) {
  switch (s.structureType) {
    case STRUCTURE_TOWER:
      return 100
    case STRUCTURE_WALL:
    case STRUCTURE_RAMPART:
      return 10
    default:
      return 1
  }
}

export function runBuilder(creep: Creep) {
  if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.building = false
    creep.say('🔄 harvest')
  }
  if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
    creep.memory.building = true
    creep.say('🚧 build')
  }

  if (creep.memory.building) {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES)
    targets[0].structureType
    if (targets.length > 0) {
      const target = findMaxBy(getBuildPriority, targets)
      if (creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}})
      }
    }
  } else {
    const sources = creep.room.find(FIND_SOURCES)
    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}})
    }
  }
}

export function createBasicBuilder(spawn: StructureSpawn) {
  return spawn.spawnCreep([WORK, CARRY, MOVE], ['B1', spawn.name, Game.time].join('.'), {
    memory: { role: CreepRole.Builder }
  })
}

export function keepBuilder(room: Room) {
  const needBuilds = room.find(FIND_CONSTRUCTION_SITES)
  const builders = room.find(FIND_MY_CREEPS, {
    filter: c => c.memory.role === CreepRole.Builder
  })
  if (builders.length * 5 >= needBuilds.length) return
  
  const spawns = room.find(FIND_MY_SPAWNS, {
    filter: s => !s.spawning && s.isActive()
  })
  if (spawns.length < 1) return
  createBasicBuilder(spawns[0])
}