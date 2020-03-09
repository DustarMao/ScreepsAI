import {runCreep} from "./creep"
import {keepCreeps} from "./spawn"

/**
 * main loop
 */
export function loop() {
  console.log(`current tick is ${Game.time}!`)

  _.values(Game.creeps).forEach(runCreep)
  _.values(Game.rooms).forEach(keepCreeps)
}
