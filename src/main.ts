import runAllCreeps from "./creep"

export function loop() {
  console.log(`current tick is ${Game.time}`)

  runAllCreeps()
}