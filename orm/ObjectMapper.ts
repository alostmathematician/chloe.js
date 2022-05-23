import {
    DeleteResult,
    Document,
    Filter,
    ModifyResult,
    OptionalUnlessRequiredId,
    UpdateFilter,
    UpdateResult
} from 'mongodb'
import {Constructor} from "../misc/util";
import {ENTITY_PROPS, EntityPropMeta, EntityProps, ID} from "../Annotation/EntityAnnotation";

export type MongoSourceType = Filter<Document> | UpdateFilter<Document> |
    OptionalUnlessRequiredId<Document>
export type MongoResultType = DeleteResult | ModifyResult | Document | UpdateResult

interface IObjectMapper<TObject, TQuery, TResult> {
    mapForward(obj: TObject): TQuery
    mapBackward(result: TResult): TObject
}

type Mapper = Record<string, string>

abstract class ObjectMapper<TObject,TQuery,TResult>
    implements IObjectMapper<TObject, TQuery, TResult>{

    protected target: Constructor<TObject>
    protected forwardMapper: Mapper
    protected backwardMapper: Mapper

    protected constructor(target: Constructor<TObject>) {
        this.target = target
        this.createForwardMapper()
    }

    abstract mapBackward(result: TResult): TObject;

    abstract mapForward(obj: TObject): TQuery;

    protected mapId(idKey: string) {
        const id = Reflect.getMetadata(ID,this.target.prototype)
        this.forwardMapper[id] = idKey
        this.backwardMapper[idKey] = id
    }

    private createForwardMapper() {
        const entityProps: EntityProps =
            Reflect.getMetadata(ENTITY_PROPS,this.target.prototype)
        const keys = Object.keys(entityProps)
        keys.map(key => {
            const entityProp: EntityPropMeta =
                entityProps[key]
            this.forwardMapper[entityProp.name as string] =
                key
            this.backwardMapper[key] =
                entityProp.name as string
        })
    }

}

class MongoMapper<TObject>
    extends ObjectMapper<TObject,MongoSourceType,MongoResultType> {

    constructor(obj: Constructor<TObject>) {
        super(obj);
    }

    mapForward(obj: TObject): MongoSourceType {
        const objKeys = Object.keys(obj)
        const result: MongoSourceType = {}
        objKeys.map(key => {
            result[this.forwardMapper[key]] = obj[key]
        })
        return result
    }

    mapBackward(result: MongoResultType): TObject {
        const resultKeys = Object.keys(result)
        const obj = new this.target()
        resultKeys.map(key => {
            obj[this.backwardMapper[key]] = result[key]
        })
        return obj
    }
}