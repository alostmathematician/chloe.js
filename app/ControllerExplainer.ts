import {AbstractExplainer} from "./Explainer";
import express, {Application, Router} from 'express'
import 'reflect-metadata'
import {ControllerFunctionMeta, MAJOR_ROUTE, RestMethod} from "../Annotation/ControllerAnnotation";
import {IOCContainer} from "../ioc/container";
import {CHLOE_PROPERTY, PropsMeta} from "../Annotation/common";
import {Constructor} from "../misc/util";
import {RouterPicker} from "../server/server";

export class ControllerExplainer extends AbstractExplainer<any> {
    protected app: Application
    constructor(container: IOCContainer<any>) {
        super(container);
        this.app = express()

    }

    explain(target: Constructor<any>): void {

    }

    protected defineMajorRoute(router: Router, target: Constructor<any>) {
        const route: string = Reflect.getMetadata(MAJOR_ROUTE,target.prototype)
        this.app.use(route,router)
    }

    protected async getAutoWiredProps(target: Constructor<any>) {
        const autoWired: PropsMeta =
            Reflect.getMetadata(CHLOE_PROPERTY, target.prototype)
        const keys = Object.keys(autoWired)
        await Promise.all(keys.map(key => {
            target.prototype[autoWired[key].name] = this.container.getInstance(target.name)
        }))
    }

    protected buildRouter(funcMeta: ControllerFunctionMeta) {
        const method: RestMethod = funcMeta.method
        const methodMapper = new RouterPicker()
        const matcher = methodMapper.map(method)
        matcher(funcMeta.route,)
    }
}