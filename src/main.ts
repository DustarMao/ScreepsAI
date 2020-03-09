import {runCreep} from "./creep"
import {keepCreeps} from "./spawn"

function init() {
  if (Memory.object == null) {
    Memory.object = {}
  }
}

/**
 * main loop
 */
export function loop() {
  init()
  console.log(`current tick is ${Game.time}!`)

  _.values(Game.creeps).forEach(runCreep)
  _.values(Game.rooms).forEach(keepCreeps)
}
