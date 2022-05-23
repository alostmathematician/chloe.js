import {Mapper} from "./Mapper";
import 'reflect-metadata'
import {ID} from "../../Annotation/EntityAnnotation";
import {Constructor} from "../../misc/util";
import {
    DeleteResult,
    Document,
    Filter,
    InsertManyResult,
    InsertOneResult,
    OptionalId,
    UpdateFilter,
    UpdateResult,
    WithId
} from "mongodb";


export type MongoInputType = Filter<Document> | OptionalId<Document> |
    UpdateFilter<Document> | Partial<Document>
export type MongoReturnType = DeleteResult | WithId<Document> |
    InsertOneResult | InsertManyResult | UpdateResult

export class MongoMapper<TSource>
    extends Mapper<TSource,MongoInputType,MongoReturnType> {

    constructor(target: Constructor<TSource>) {
        super(target);
    }

    backwardMap(source: MongoReturnType): TSource {
        const value = new this.target()
        const keys = Object.keys(source)
        keys.map(key => {
            value[this.backwardMapper[key]] = source[key]
        })
        return value
    }

    forwardMap(source: TSource): MongoInputType {
        const input: MongoInputType = {}
        const keys = Object.keys(source)
        keys.map(key => {
            input[this.forwardMapper[key]] = source[key]
        })
        return input
    }

    protected idBuilder() {
        const id: string = Reflect.getMetadata(ID, this.target.prototype)
        this.forwardMapper[id] = '_id'
        this.backwardMapper['_id'] = id
    }

}