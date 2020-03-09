export function findMaxBy<A>(fn: (item: A) => number, array: A[]) {
  if (array.length === 0) return undefined
  return array.reduce((ret, it) => {
    const prev = fn(ret)
    const cur = fn(it)
    return cur > prev ? it : ret
  })
}
