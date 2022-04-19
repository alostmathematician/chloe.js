import {ClassType, defineClassType, FunctionMeta, ParamMeta} from "./common";
import 'reflect-metadata'

export const MAJOR_ROUTE = 'MAJOR_ROUTE'
export const CONTROLLER_FUNCTION = 'CONTROLLER_FUNCTION'

export enum RestMethod {
    GET,
    POST,
    UPDATE,
    DELETE
}

export enum RestParam {
    QUERY,
    BODY,
    PARAM
}

export interface ControllerParamMeta extends ParamMeta {
    method: RestParam,
}

export interface ControllerFunctionMeta extends FunctionMeta<ControllerParamMeta> {
    method?: RestMethod,
    route?: string
}

export const Controller = (url?: string): ClassDecorator => (target) => {
    defineClassType(ClassType.CONTROLLER, target)
    Reflect.defineMetadata(MAJOR_ROUTE, url ? url : '/', target.prototype)
}

const restMethod = (method: RestMethod) =>
    (route?: string): MethodDecorator =>
        (target, propertyKey, descriptor) => {
    const func: ControllerFunctionMeta =
        Reflect.getMetadata(CONTROLLER_FUNCTION,target,propertyKey) ||
        {name: propertyKey, params: [], method, route}
    if (func.params.length > 0) {
        func.params.reverse()
        const paramsType: Function[] = Reflect.getMetadata(
            'design:paramtypes',
            target,
            propertyKey)
        paramsType.map((type,index) => {
            func.params[index].type = type
        })
        func.method = method
        func.route = route
    }
    Reflect.defineMetadata(CONTROLLER_FUNCTION,func,target,propertyKey)
}

export const Get = restMethod(RestMethod.GET)
export const Post = restMethod(RestMethod.POST)
export const Update = restMethod(RestMethod.UPDATE)
export const Delete = restMethod(RestMethod.DELETE)

const restParam = (method: RestParam) =>
    (name?: string): ParameterDecorator =>
        (target, propertyKey, parameterIndex) => {
    const func: ControllerFunctionMeta =
        Reflect.getMetadata(CONTROLLER_FUNCTION,target,propertyKey) ||
        {name: propertyKey,params: []}
    const param: ControllerParamMeta = {
        index: parameterIndex,
        method,
        name
    }

    func.params.push(param)
    Reflect.defineMetadata(CONTROLLER_FUNCTION,func,target,propertyKey)
}

export const Query = restParam(RestParam.QUERY)
export const Body = restParam(RestParam.BODY)
export const Param = restParam(RestParam.PARAM)





