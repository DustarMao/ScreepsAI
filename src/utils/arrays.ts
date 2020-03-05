export function sortBy<A, B extends number|string>(fn: (item: A) => B, array: A[]) {
  return array.sort((a, b) => {
    const _a = fn(a)
    const _b = fn(b)
    return _a < _b ? -1 : _a > _b ? 1 : 0
  })
}

export function findMaxBy<A>(fn: (item: A) => number, array: A[]) {
  return array.reduce((ret, it) => {
    const prev = fn(ret)
    const cur = fn(it)
    return cur > prev ? it : ret
  })
}