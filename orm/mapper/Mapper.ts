import {Constructor} from "../../misc/util";
import {ENTITY_PROPS, EntityProps} from "../../Annotation/EntityAnnotation";
import 'reflect-metadata'

export interface IMapper<TSource, TQuery, TReturn> {
    forwardMap(obj: TSource): TQuery
    backwardMap(obj: TReturn): TSource
}

export abstract class Mapper<TSource,TQuery,TReturn>
    implements IMapper<TSource, TQuery, TReturn> {
    protected readonly target: Constructor<TSource>
    protected forwardMapper: Record<string,string> = {}
    protected backwardMapper: Record<string, string> = {}

    protected constructor(target: Constructor<TSource>) {
        this.target = target
        this.buildMapper()
        this.idBuilder()
    }

    abstract backwardMap(obj: TReturn): TSource;

    abstract forwardMap(obj: TSource): TQuery;

    protected abstract idBuilder()

    private buildMapper() {
        const props: EntityProps =
            Reflect.getMetadata(ENTITY_PROPS,this.target.prototype)
        const keys = Object.keys(props)
        keys.map(key => {
            this.forwardMapper[key] =
                props[key].name as string
            this.backwardMapper[props[key].name as string] = key
        })
    }

}

