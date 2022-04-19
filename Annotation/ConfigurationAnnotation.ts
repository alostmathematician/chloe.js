import {ClassType, defineClassType, FunctionMeta, ParamMeta} from "./common";
import 'reflect-metadata'

export const BEAN = 'BEAN'

export interface ConfigFunctionMeta extends Omit<FunctionMeta<ParamMeta>,'params'> {
    methodName: string | symbol
}

export const Configuration: ClassDecorator = (target) => {
    defineClassType(ClassType.Configuration, target)
}

export const Bean: MethodDecorator =
    (target, propertyKey, descriptor) => {
    const bean: ConfigFunctionMeta = {
        name: Reflect.getMetadata('design:returntype', target, propertyKey).name,
        methodName: propertyKey
    }
    Reflect.defineMetadata(BEAN, bean, target, propertyKey)
}