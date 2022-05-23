import {Mapper} from "./Mapper";
import 'reflect-metadata'
import {ID} from "../../Annotation/EntityAnnotation";
import {Constructor} from "../../misc/util";

export type MysqlInputType = Record<string, any>

export class MysqlMapper<TSource>
    extends Mapper<TSource, MysqlInputType, any> {

    constructor(target: Constructor<TSource>) {
        super(target);
    }

    backwardMap(obj: any): TSource {
        const keys = Object.keys(obj)
        const value = new this.target()
        keys.map(key => {
            value[this.backwardMapper[key]] = obj[key]
        })
        return value
    }

    forwardMap(obj: TSource): MysqlInputType {
        const input: MysqlInputType = {}
        const keys = Object.keys(obj)
        keys.map(key => {
            input[this.forwardMapper[key]] = obj[key]
        })
        return input
    }


    protected idBuilder() {
        const id: string = Reflect.getMetadata(ID, this.target.prototype)
        this.forwardMapper[id] = id
        this.backwardMapper[id] = id
    }

}