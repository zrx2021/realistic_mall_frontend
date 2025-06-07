/**
 * 深拷贝工具函数
 * @param source 要拷贝的源数据
 * @returns 深拷贝后的新对象
 */
export function deepClone<T>(source: T): T {
  // 处理基本类型和 null
  if (source === null || typeof source !== 'object') {
    return source
  }

  // 处理数组
  if (Array.isArray(source)) {
    return source.map((item) => deepClone(item)) as unknown as T
  }

  // 处理日期对象
  if (source instanceof Date) {
    return new Date(source.getTime()) as unknown as T
  }

  // 处理正则表达式
  if (source instanceof RegExp) {
    return new RegExp(source.source, source.flags) as unknown as T
  }

  // 处理 Map
  if (source instanceof Map) {
    const cloneMap = new Map()
    source.forEach((value, key) => {
      cloneMap.set(deepClone(key), deepClone(value))
    })
    return cloneMap as unknown as T
  }

  // 处理 Set
  if (source instanceof Set) {
    const cloneSet = new Set()
    source.forEach((value) => {
      cloneSet.add(deepClone(value))
    })
    return cloneSet as unknown as T
  }

  // 处理普通对象和类实例
  const cloneObj: Record<string, unknown> = {}
  // const sourceObj = source as Record<string, unknown>

  // 处理原型链
  Object.setPrototypeOf(cloneObj, Object.getPrototypeOf(source))

  // 处理符号属性
  const symbolKeys = Object.getOwnPropertySymbols(source)
  const allKeys = [...Object.keys(source), ...symbolKeys] as Array<string | symbol>

  for (const key of allKeys) {
    const descriptor = Object.getOwnPropertyDescriptor(source, key)

    if (descriptor) {
      if ('value' in descriptor) {
        // 数据属性
        Object.defineProperty(cloneObj, key, {
          ...descriptor,
          value: deepClone(descriptor.value),
        })
      } else {
        // 访问器属性 (getter/setter)
        Object.defineProperty(cloneObj, key, descriptor)
      }
    }
  }

  return cloneObj as T
}
