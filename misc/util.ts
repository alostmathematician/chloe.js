export type Constructor<T> = T extends new(...args: any[]) => T ? T : undefined

export function isFunction(obj: any): obj is Function {
    return typeof obj === 'function'
}

export function isConstructor(obj: string) {
    return obj === 'constructor'
}

export function isPromise(obj: any): obj is Promise<any> {
    return !!obj && typeof obj.then() === 'function'
}

export function isPod(obj: any) {
    return typeof obj === 'string' ||
        typeof obj === 'symbol' ||
        typeof obj === 'number' ||
        typeof obj === 'bigint' ||
        typeof obj === 'boolean' ||
        typeof obj === 'undefined'
}

export function isSameType(obj1: any, obj2: any) {
    const t1 = isPod(obj1)
    const t2 = isPod(obj2)
    if (t1 && t2) {
        return typeof obj1 === typeof obj2
    }

    if (!t1 && t2) return false
    if (t1 && !t2) return false
    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)
    if (keys1.length !== keys2.length) return false
    for (let key of keys1) {
        if (keys2.indexOf(key) === -1) return false
        if (!isSameType(obj1[key],obj2[key])) {
            return false
        }
    }
    return true
}