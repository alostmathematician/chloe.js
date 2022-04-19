import 'reflect-metadata'
import {Constructor} from "../misc/util";

export const CHLOE_PROPERTY = 'CHLOE_PROPERTY'
export const CHLOE_CLASS = 'CHLOE_CLASS'

export enum PropType {
    AUTOWIRED,
}

export enum FuncType {
    REST
}

export interface PropMeta {
    method: PropType,
    type: Function,
    name: string | symbol
}

export interface ParamMeta {
    index: number,
    type?: Function,
    name?: string
}

export type Parameters<T extends ParamMeta> = T[]

export interface FunctionMeta<T extends ParamMeta> {
    name: string | symbol,
    params: Parameters<T>
}

export type PropsMeta = Record<string | symbol, PropMeta>
export const AutoWired: PropertyDecorator =
    (target, propertyKey) => {
    const props: PropsMeta = Reflect.getMetadata(CHLOE_PROPERTY,target) ||
        {}
    props[propertyKey] = {
        method: PropType.AUTOWIRED,
        type: Reflect.getMetadata('design:type', target, propertyKey),
        name: propertyKey
    }
    Reflect.defineMetadata(CHLOE_PROPERTY, props, target)
}


export enum ClassType {
    CONTROLLER,
    Component,
    Configuration,
    REPOSITORY,
    ENTITY
}

export const defineClassType = (type: ClassType,target: Constructor<any>) => {
    Reflect.defineMetadata(CHLOE_CLASS,type,target)
}