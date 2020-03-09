type ActionMethodKey<T> = {
  [K in keyof T]:
    T[K] extends (...args: any[]) => number ? K : never
}[keyof T]
type IdOrName = {
  id?: Id<unknown>
  name?: string
}

export interface OrderResult {
  code: number
  deal(effectMap: Record<number, () => void>): void
}

export function buildOrderResult(code: number, id = 'NO_ID'): OrderResult {
  return {
    code,
    deal: (effectMap) => {
      const effect = effectMap[code]
      if (effect != null) {
        return effect()
      }
      if (code === OK) {
        return OK
      }

      console.warn('unhandled bad order code %d on %s', code, id)
      return code
    }
  }
}

export default function order<T extends IdOrName, K extends ActionMethodKey<T>>(obj: T, method: K, ...args: Parameters<T[K]>): OrderResult {
  const result: number = obj[method](...args)
  return buildOrderResult(result, 'id' in obj ? obj.id : obj.name)
}