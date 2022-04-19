import {ClassType, defineClassType} from "./common";

const Repository: ClassDecorator = (target) => {
    defineClassType(ClassType.REPOSITORY, target)
}