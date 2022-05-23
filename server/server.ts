import {RestMethod} from "../Annotation/ControllerAnnotation";
import {IRouterMatcher, Router} from "express";

export class RouterPicker {
    private router: Router = Router()
    private routerFactory: Record<RestMethod, IRouterMatcher<any>> = {
        "0": this.router.get,
        "1": this.router.post,
        "2": this.router.put,
        "3": this.router.delete
    }

    getRouter() {
        return this.router
    }

    map(method: RestMethod) {
        return this.routerFactory[method]
    }
}