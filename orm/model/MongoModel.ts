import {ModelImpl} from "./Model";
import {Collection, Db, MongoClient} from "mongodb";
import {MongoConnector} from "../connector/MongoConnector";
import {MongoInputType, MongoMapper, MongoReturnType} from "../mapper/MongoMapper";
import {Constructor} from "../../misc/util";

class MongoModel<ID, TSource>
    extends ModelImpl<ID,
        TSource,
        MongoInputType,
        MongoReturnType,
        MongoClient,
        MongoConnector,
        Db,
        Collection> {
    protected db: Db
    protected collection: Collection
    protected connection: MongoClient

    constructor(target: Constructor<TSource>) {
        super(target);
        this.mapper = new MongoMapper(target)
    }

    setConnector(connector: MongoConnector) {
        super.setConnector(connector);
        this.connection = this.connector.getConnection()
        this.db = this.connection.db()
    }

    setDataBase(name: string) {
        this.db = this.connection.db(name)
    }

    setTable(name: string) {
        this.collection = this.db.collection(name)
    }

    async deleteById(id: ID): Promise<boolean> {
        const value = await this.collection.deleteOne({_id: id})
        return value.acknowledged
    }

    async deleteMany(query: TSource): Promise<boolean> {
        const input: MongoInputType = this.mapper.forwardMap(query)
        const value = await this.collection.deleteMany(input)
        return value.acknowledged
    }

    async deleteOne(query: TSource): Promise<boolean> {
        const value = await this.collection.deleteOne(this.mapper.forwardMap(query))
        return value.acknowledged
    }

    async findAll(): Promise<TSource[]> {
        const values = await this.collection.find().toArray()
        return await Promise.all(values.map(value => {
            return this.mapper.backwardMap(value)
        }))
    }

    async findById(id: ID): Promise<TSource> {
        const value = await this.collection.findOne({_id: id})
        return this.mapper.backwardMap(value)
    }

    async findMany(query: TSource): Promise<TSource[]> {
        const values = await this.collection.find(this.mapper.forwardMap(query)).toArray()
        return await Promise.all(values.map(value => {
            return this.mapper.backwardMap(value)
        }))
    }

    async findOne(query: TSource): Promise<TSource> {
        const value = await this.collection.findOne(this.mapper.forwardMap(query))
        return this.mapper.backwardMap(value)
    }

    async insertMany(query: TSource[]): Promise<boolean> {
        const input = await Promise.all(query.map(q => {
            return this.mapper.forwardMap(q)
        }))
        const value = await this.collection.insertMany(input)
        return value.acknowledged
    }

    async insertOne(query: TSource): Promise<boolean> {
        const value = await this.collection.insertOne(this.mapper.forwardMap(query))
        return value.acknowledged
    }

    async updateMany(query: TSource, update: TSource): Promise<boolean> {
        const value = await this.collection.updateMany(this.mapper.forwardMap(query),
            this.mapper.forwardMap(update))
        return value.acknowledged
    }

    async updateOne(query: TSource, update: TSource): Promise<boolean> {
        const value = await this.collection.updateMany(this.mapper.forwardMap(query),
            this.mapper.forwardMap(update))
        return value.acknowledged
    }

}