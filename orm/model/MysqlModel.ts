import {ModelImpl} from "./Model";
import {Connection, QueryOptions} from 'mysql'
import {MysqlConnector} from "../connector/MysqlConnector";
import {MysqlInputType, MysqlMapper} from "../mapper/MysqlMapper";
import {promisify} from 'util'
import {Constructor} from "../../misc/util";

class MysqlModel<ID,TSource>
    extends ModelImpl<ID,
        TSource,
        MysqlInputType,
        any,
        Connection,
        MysqlConnector,
        undefined,
        string> {

    protected connection: Connection
    protected table: string
    private readonly queryPromise: (query: string | QueryOptions) => Promise<unknown>

    constructor(target: Constructor<TSource>) {
        super(target);
        this.mapper = new MysqlMapper(target)
        this.queryPromise = promisify(this.connection.query)
    }

    setDataBase(name: string) {
    }

    setTable(name: string) {
        this.table = name
    }

    setConnector(connector: MysqlConnector) {
        super.setConnector(connector);
        this.connection = this.connector.getConnection()
    }

    async deleteById(id: ID): Promise<boolean> {
        const Id: string = Reflect.getMetadata(ID, this.target.prototype)
        try {
            const value: any =
                await this.queryPromise(`delete from ${this.table} where ${Id}=${id}`)
            return value.length > 0;

        } catch (err) {
            throw err.message
        }

    }

    async deleteMany(query: TSource): Promise<boolean> {
        try {
            const sql = this.mapToDelete(query,false)
            const value: any =
                await this.queryPromise(sql)
            return value.length > 0
        } catch (err) {
            throw err.message
        }
    }

    async deleteOne(query: TSource): Promise<boolean> {
        try {
            const sql = this.mapToDelete(query, true)
            const value: any =
                await this.queryPromise(sql)
            return value.length > 0
        } catch (err) {
            throw err.message
        }
    }

    async findAll(): Promise<TSource[]> {
        const sql = `select * from ${this.table}`
        try {
            const values: any = await this.queryPromise(sql)
            let objs: TSource[] = []
            await Promise.all(values.map(value => {
                objs.push(this.mapper.backwardMap(value))
            }))
            return objs
        } catch (err) {
            throw err.message
        }
    }

    findById(id: ID): Promise<TSource> {
        return Promise.resolve(undefined);
    }

    findMany(query: TSource): Promise<TSource[]> {
        return Promise.resolve([]);
    }

    findOne(query: TSource): Promise<TSource> {
        return Promise.resolve(undefined);
    }

    insertMany(query: TSource[]): Promise<boolean> {
        return Promise.resolve(false);
    }

    insertOne(query: TSource): Promise<boolean> {
        return Promise.resolve(false);
    }

    updateMany(query: TSource, update: TSource): Promise<boolean> {
        return Promise.resolve(false);
    }

    updateOne(query: TSource, update: TSource): Promise<boolean> {
        return Promise.resolve(false);
    }

    private mapToDelete(query: TSource, onlyOne: boolean) {
        const input = this.mapper.forwardMap(query)
        let sql = `delete from ${this.table} where `
        const keys = Object.keys(input)
        keys.map(key => {
            sql += `${key}=${input[key]},`
        })
        sql = sql.substring(0,sql.length - 1)
        if (onlyOne) {
            sql += ' limit 1'
        }
        return sql
    }

}