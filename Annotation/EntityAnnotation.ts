import {ClassType, defineClassType, PropMeta} from "./common";
import 'reflect-metadata'

export const ENTITY: string = 'ENTITY'
export const TABLE: string = 'TABLE'
export const ID: string = 'ID'
export const GENERATE_VALUE: string = 'GENERATE_VALUE'

export enum GenerationType {
    AUTO,
    IDENTITY,
    SEQUENCE,
    TABLE
}

export interface GenerationValue {
    name: string | symbol,
    strategy: GenerationType
}

export interface EntityPropMeta extends Omit<PropMeta, 'method'> {
    nullable: boolean,
    min: number,
    max: number
    unique: boolean
}

export type EntityProps = Record<string | symbol, EntityPropMeta>
export const ENTITY_PROPS: string = 'ENTITY_PROPS'

export const Entity = (name?: string): ClassDecorator => (target) => {
    defineClassType(ClassType.ENTITY, target)
    Reflect.defineMetadata(ENTITY, name ? name : target.name, target.prototype)
}

export const Table = (name?: string): ClassDecorator => (target) => {
    Reflect.defineMetadata(TABLE, name ? name : target.name, target.prototype)
}

export const Id: PropertyDecorator = (target, propertyKey) => {
    const id = Reflect.getMetadata(ID,target)
    if (id) {
        throw new Error(`${id} for id has already defined`)
    }
    Reflect.defineMetadata(ID, propertyKey, target)
}

export const GenerateValue = (strategy?: GenerationType): PropertyDecorator =>
    (target, propertyKey) => {
    const generatedValue = Reflect.getMetadata(GENERATE_VALUE, target)
    if (generatedValue) {
        throw new Error(`${generatedValue} for generate value has already define`)
    }
    const generateValue: GenerationValue = {
        name: propertyKey,
        strategy: strategy ? strategy : GenerationType.AUTO
    }
    Reflect.defineMetadata(GENERATE_VALUE,generateValue,target)
}

export const Column = (
    name?: string | symbol,
    min?: number,
    max?: number,
    nullable?: boolean,
    unique?: boolean): PropertyDecorator =>
    (target, propertyKey) => {
    const entityProp: EntityPropMeta = {
        type: Reflect.getMetadata('design:type', target, propertyKey),
        name: propertyKey,
        nullable: nullable ? nullable : true,
        min: min || 0,
        max: max || Number.MAX_SAFE_INTEGER,
        unique: unique ? unique : true
    }
    const entityProps: EntityProps = Reflect.getMetadata(ENTITY_PROPS, target) ||
        {}
    entityProps[name ? name : propertyKey] = entityProp
    Reflect.defineMetadata(ENTITY_PROPS, entityProps,target)
}