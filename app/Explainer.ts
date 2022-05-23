import {Constructor, isConstructor, isFunction} from "../misc/util";
import {CHLOE_CLASS, ClassType} from "../Annotation/common";
import 'reflect-metadata'
import {IOCContainer} from "../ioc/container";
import {IConfig} from "../config/Config";
import {ControllerExplainer} from "./ControllerExplainer";

export abstract class AbstractExplainer<TSource> {
    protected container: IOCContainer<any>
    protected config: IConfig<string> | undefined
    protected constructor(container: IOCContainer<any>,config?: IConfig<string>) {
        this.config = config
        this.container = container
    }

    static getMainType<TSource>(target: Constructor<TSource>): ClassType {
        return Reflect.getMetadata(CHLOE_CLASS, target)
    }

    abstract explain(target: Constructor<TSource>): void

    protected getProtoMethodNames(target: Constructor<TSource>) {
        const prototype = target.prototype
        return Object.getOwnPropertyNames(prototype).filter(methodName => {
            return !isConstructor(methodName) && isFunction(prototype[methodName])
        })
    }
}




class ExplainerFactory {
    static factory: Record<ClassType, IExplainer<any>> = {
        0: new ControllerExplainer(),
        1: new ComponentExplainer(),
        2: new ConfigurationExplainer(),
        3: new RepositoryExplainer(),
        4: new EntityExplainer()
    }

    static getExplainer(type: ClassType) {
        return this.factory[type]
    }
}

