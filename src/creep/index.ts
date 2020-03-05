import {runHarvester} from './harvester'
import {runBuilder} from './builder'
import {runUpgrader} from './upgrader'

export function runCreep(creep: Creep) {
  switch (creep.memory.role) {
    case CreepRole.Harvester:
      return runHarvester(creep)
    case CreepRole.Builder:
      return runBuilder(creep)
    case CreepRole.Upgrader:
      return runUpgrader(creep)
  }
}
