import {findMaxBy} from '../utils/arrays'

const chargePriority: Record<string, number> = {
  [STRUCTURE_TOWER]: 100,
  [STRUCTURE_SPAWN]: 10,
  [STRUCTURE_EXTENSION]: 1,
}
function findTargetSource(creep: Creep) {
  const targetId = creep.memory.target
  if (targetId != null) {
    const target = Game.resources[targetId]
    if (target != null) {
      return target
    }
  }
  return creep.pos.findClosestByPath(FIND_SOURCES)
}
export function runHarvester(creep: Creep) {
  if (creep.store.getFreeCapacity() > 0) {
    const target = findTargetSource(creep)
    if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target)
    }
  } else {
    const targets = creep.room.find(FIND_MY_STRUCTURES, {
      filter: s => {
        if (s.structureType in chargePriority) {
          return (
            (s as StructureSpawn).store.getFreeCapacity(RESOURCE_ENERGY) > 0
          )
        } else {
          return false
        }
      },
    })
    if (targets.length > 0) {
      const target = findMaxBy(
        s => chargePriority[s.structureType] ?? 0,
        targets
      )
      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target)
      }
    }
  }
}

export function createBasicHarvester(
  spawn: StructureSpawn,
  options: Partial<CreepMemory> = {}
) {
  return spawn.spawnCreep(
    [WORK, CARRY, MOVE],
    ['H1', spawn.name, Game.time].join('.'),
    {
      memory: {...options, role: CreepRole.Harvester},
    }
  )
}

const HARVESTER_PER_SOURCE = 2
export function keepHarvester(room: Room) {
  const sources = room.find(FIND_SOURCES_ACTIVE)
  const harvesters = room.find(FIND_MY_CREEPS, {
    filter: c => c.memory.role === CreepRole.Harvester,
  })
  sources.forEach(source => {
    const mineCreep = harvesters.filter(c => c.memory.target === source.id)
    if (mineCreep.length >= HARVESTER_PER_SOURCE) return
    const spawn = source.pos.findClosestByPath(FIND_MY_SPAWNS, {
      filter: s => !s.spawning && s.isActive(),
    })
    if (spawn != null) {
      createBasicHarvester(spawn, {target: source.id})
    }
  })
}
