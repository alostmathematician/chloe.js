import {AbstractExplainer} from "./Explainer";
import {IOCContainer} from "../ioc/container";
import 'reflect-metadata'
import {BEAN, ConfigFunctionMeta} from "../Annotation/ConfigurationAnnotation";
import {Constructor} from "../misc/util";

export class ConfigExplainer extends AbstractExplainer<any> {
    constructor(container: IOCContainer<any>) {
        super(container);
    }
    explain(target: Constructor<any>): void {
        const methodNames = this.getProtoMethodNames(target)
        methodNames.map(name => {
            const bean: ConfigFunctionMeta | undefined =
                Reflect.getMetadata(BEAN,target.prototype,name)
            if (bean) {
                const targetFunc: Function = target.prototype[name]
                this.container.register(
                    bean.name as string,
                    targetFunc.apply(target.prototype)
                )
            }
        })
    }

}