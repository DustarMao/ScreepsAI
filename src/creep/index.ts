import {runHarvester} from './harvester'
import {runBuilder} from './builder'
import {runUpgrader} from './upgrader'

export default function runAllCreeps() {
  for (const creep of Object.values(Game.creeps)) {
    switch (creep.memory.role) {
      case CreepRole.Harvester:
        runHarvester(creep)
      case CreepRole.Builder:
        runBuilder(creep)
      case CreepRole.Upgrader:
        runUpgrader(creep)
    }
  }
}
