import {IConnector} from "../connector/connector";
import {IMapper} from "../mapper/Mapper";
import {Constructor} from "../../misc/util";

export interface IModel<ID,
    TSource,
    TConnection,
    TConnector extends IConnector<TConnection>,
    TDataBase,
    TTable> {
    setConnector(connector: TConnector)
    setDataBase(name: string)
    setTable(name: string)
    findById(id: ID): Promise<TSource>
    findAll(): Promise<TSource[]>
    findOne(query: TSource): Promise<TSource>
    findMany(query: TSource): Promise<TSource[]>
    insertOne(query: TSource): Promise<boolean>
    insertMany(query: TSource[]): Promise<boolean>
    updateOne(query: TSource,update: TSource): Promise<boolean>
    updateMany(query: TSource,update: TSource): Promise<boolean>
    deleteOne(query: TSource): Promise<boolean>
    deleteMany(query: TSource): Promise<boolean>

    deleteById(id: ID): Promise<boolean>
}

export abstract class ModelImpl<ID,
    TSource,
    TQuery,
    TReturn,
    TConnection,
    TConnector extends IConnector<TConnection>,
    TDataBase,
    TTable>
    implements IModel<ID, TSource, TConnection, TConnector,TDataBase,TTable> {
    protected connector: TConnector
    protected mapper: IMapper<TSource, TQuery, TReturn>
    protected target: Constructor<TSource>

    protected constructor(target: Constructor<TSource>) {
        this.target = target
    }
    abstract deleteById(id: ID): Promise<boolean>;

    abstract deleteMany(query: TSource): Promise<boolean>;

    abstract deleteOne(query: TSource): Promise<boolean>;

    abstract findAll(): Promise<TSource[]>;

    abstract findById(id: ID): Promise<TSource>;

    abstract findMany(query: TSource): Promise<TSource[]>;

    abstract findOne(query: TSource): Promise<TSource>;

    abstract insertMany(query: TSource[]): Promise<boolean>;

    abstract insertOne(query: TSource): Promise<boolean>;

    setConnector(connector: TConnector) {
        this.connector = connector
    }

    abstract setDataBase(name: string);

    abstract setTable(name: string);

    abstract updateMany(query: TSource, update: TSource): Promise<boolean>;

    abstract updateOne(query: TSource, update: TSource): Promise<boolean>;

}
