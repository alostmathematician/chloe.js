import {ClassType, defineClassType} from "./common";

export const Component: ClassDecorator = (target) => {
    defineClassType(ClassType.Component, target)
}