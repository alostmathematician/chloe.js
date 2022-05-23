import {AbstractExplainer} from "./Explainer";
import {IOCContainer} from "../ioc/container";
import {Constructor} from "../misc/util";

export class ComponentExplainer extends AbstractExplainer<any>{
    constructor(container: IOCContainer<any>) {
        super(container);
    }

    explain(target: Constructor<any>): void {
        this.container.register(target)
    }
}