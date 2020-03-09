const MODELS = {
  'W1': [WORK, MOVE, CARRY]
}

export function spawnCreep(spawn: StructureSpawn, model: keyof typeof MODELS, memory: CreepMemory) {
  spawn.spawnCreep(MODELS[model], [model, spawn.name, Game.time].join('.'), {memory})
}