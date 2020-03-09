const MODELS = {
  'W1': [WORK, MOVE, CARRY]
}

export function spawnCreep(spawn: StructureSpawn, model: keyof typeof MODELS, memory?: CreepMemory) {
  const name = [model, spawn.name, Game.time].join('.')
  const code = spawn.spawnCreep(MODELS[model], name, {memory})
  return {code, creep: Game.creeps[name]}
}