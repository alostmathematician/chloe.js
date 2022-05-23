import {Constructor} from "../misc/util";
import {CHLOE_PROPERTY, PropsMeta} from "../Annotation/common";


export interface ContainerUnit<T> {
    name: string | symbol,
    target?: Constructor<T>
    obj?: object,
    dependencies?: PropsMeta
}

export type Container<T> = Record<string, ContainerUnit<any>>

export interface IOCContainer<T> {
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
            const props: PropsMeta =
                this.container[name].dependencies
            const keys = Object.keys(props)
            const instance = new this.container[name].target()
            await Promise.all(keys.map(async key => {
                instance[key] = await this.getInstance(key)
            }))
            this.container[name].obj = instance
            return instance
        }
    }

    register(meta: Constructor<any>);
    register(name: string, obj: object);
    register(meta: Constructor<any> | string, obj?: object) {
        if (typeof meta === "string") {
            this.container[meta] = {
                name: meta,
                obj: obj
            }
        } else {
            this.container[meta.name] = {
                name: meta.name,
                target: meta,
                dependencies: Reflect.getMetadata(CHLOE_PROPERTY,meta.prototype)
            }
        }
    }

}

