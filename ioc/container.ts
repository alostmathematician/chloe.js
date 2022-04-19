import {Constructor} from "../misc/util";
import {CHLOE_PROPERTY, PropsMeta} from "../Annotation/common";

export interface Dependency {
    key: string,
    name: string
}

export interface ContainerUnit<T> {
    name: string | symbol,
    target?: Constructor<T>
    obj?: object,
    dependencies?: PropsMeta
}

export type Container<T> = Record<string | symbol, ContainerUnit<T>>

interface IOCContainer<T> {
    register(meta: Constructor<T>)
    register(name: string, obj: object)
    getInstance(name: string)
}

export class SimpleContainer implements IOCContainer<any> {
    private container: Container<any> = {}
    async getInstance(name: string) {
        if (this.container[name].obj) {
            return this.container[name].obj
        } else {
            this.container[name].obj = await this.assemble(name)
            return this.container[name].obj
        }
    }

    register(meta: Constructor<any>);
    register(name: string, obj: object);
    register(meta: Constructor<any> | string, obj?: object) {
        if (typeof meta === 'string' && obj) {
            this.container[meta].name = meta
            this.container[meta].obj = obj
        }

        if (typeof meta !== 'string') {
            this.container[meta.name].name = meta.name
            this.container[meta.name].target = meta
            this.container[meta.name].dependencies =
                Reflect.getMetadata(CHLOE_PROPERTY,meta.prototype)
        }
    }

    private async assemble(name: string) {
        const target = this.container[name].target
        const instance = new target()
        if (this.container[name].dependencies &&
            Object.keys(this.container[name].dependencies).length > 0) {
            const keys = Object.keys(this.container[name].dependencies)
            await Promise.all(keys.map(async key => {
                const dependencyName = this.container[name].dependencies[key].type.name
                if (!this.container[dependencyName])
                    throw new Error(`${dependencyName} does not existed or was not registered`)
                instance[key] = await this.getInstance(dependencyName)
            }))
        }
        return instance
    }
}

