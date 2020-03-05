import {runCreep} from "./creep"
import {keepBuilder} from "./creep/builder"
import {keepUpgrader} from "./creep/upgrader"
import {keepHarvester} from "./creep/harvester"

export function loop() {
  console.log(`current tick is ${Game.time}!`)

  _.values(Game.creeps).forEach(runCreep)
  _.values(Game.rooms).forEach(room => {
    keepBuilder(room)
    keepHarvester(room)
    keepUpgrader(room)
  })
}
