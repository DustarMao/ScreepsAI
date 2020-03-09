import {getObjectMem} from "../utils/memory"

export function getNearTerrainBlank(pos: RoomPosition) {
  const {x, y, roomName} = pos
  const room = Game.rooms[roomName]

  let ret = 0
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue
      if (
        room.lookForAt(LOOK_TERRAIN, x + dx, y + dy).some(t => t !== 'wall')
      ) {
        ret++
      }
    }
  }
  return ret
}

export function filterAvailableEnergy(energy: Source) {
  if (energy.energy < 50) return false
  if (getNearTerrainBlank(energy.pos) <= (getObjectMem(energy.id).workers?.length ?? 0))
    return false
  return true
}
