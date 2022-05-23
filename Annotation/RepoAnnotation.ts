import {ClassType, defineClassType} from "./common";

export const Repository: ClassDecorator = (target) => {
    defineClassType(ClassType.REPOSITORY, target)
}