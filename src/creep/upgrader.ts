export function runUpgrader(creep: Creep) {
  const controller = creep.room.controller
  if (controller == null) return

  if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.upgrading = false
    creep.say('🔄 harvest')
  }
  if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
    creep.memory.upgrading = true
    creep.say('⚡ upgrade')
  }

  if (creep.memory.upgrading) {
    if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(controller, {
        visualizePathStyle: {stroke: '#ffffff'},
      })
    }
  } else {
    const sources = creep.room.find(FIND_SOURCES)
    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}})
    }
  }
}

export function createBasicUpgrader(spawn: StructureSpawn) {
  return spawn.spawnCreep(
    [WORK, CARRY, MOVE],
    ['U1', spawn.name, Game.time].join('.'),
    {
      memory: {role: CreepRole.Upgrader},
    }
  )
}

export function keepUpgrader(room: Room) {
  const upgraderList = room.find(FIND_MY_CREEPS, {
    filter: creep => creep.memory.role === CreepRole.Upgrader,
  })
  if (upgraderList.length >= 1) return
  const closestSpawn = room.controller?.pos.findClosestByPath(
    FIND_MY_SPAWNS,
    {
      filter: s => !s.spawning && s.isActive(),
    }
  )
  if (closestSpawn != null) {
    createBasicUpgrader(closestSpawn)
  }
}
