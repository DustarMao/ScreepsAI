import {filterAvailableEnergy} from "../resources/energy"
import {spawnCreep} from "../creep/models"

export function keepCreeps(room: Room) {
  const spawns = room.find(FIND_MY_SPAWNS, {
    filter: s => s.isActive() && !s.spawning
  })
  for (const spawn of spawns) {
    const targetSource = spawn.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
      filter: filterAvailableEnergy
    })
    if (targetSource != null)
    spawnCreep(spawn, 'W1', {
      target: targetSource.id,
      work: CreepWork.Harvest
    })
  }
}