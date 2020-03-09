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
    if (targetSource == null) break
    const [spawnWorkers, upgradeWorkers] = [CreepJob.SpawnWorker, CreepJob.Upgrader].map(job => {
      return room.find(FIND_MY_CREEPS, {
        filter: c => c.memory.job === job
      }).length
    })
    const job = spawnWorkers < spawns.length * 2
      ? CreepJob.SpawnWorker
      : upgradeWorkers < 1
        ? CreepJob.Upgrader
        : undefined
    const {creep} = spawnCreep(spawn, 'W1', {job})
    creep && console.log(`creep ${creep.name} spawning`, creep.id)
  }
}