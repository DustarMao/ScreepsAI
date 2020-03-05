export function findMaxBy<A>(fn: (item: A) => number, array: A[]) {
  return array.reduce((ret, it) => {
    const prev = fn(ret)
    const cur = fn(it)
    return cur > prev ? it : ret
  })
}
