import {Connection, createConnection} from "mysql";
import {promisify} from "util";
import {DataBaseOption} from "../../config/ConfigFile";
import {Connector} from "./connector";

export class MysqlConnector extends Connector<Connection> {
    async close(): Promise<void> {
        try {
            const promise = promisify(this.conn.end)
            await promise()
        } catch (e) {
            throw e
        }
    }

    async connect(option: DataBaseOption): Promise<void> {
        this.conn = createConnection({
            host: option.url as string,
            user: option.username as string,
            password: option.password as string,
            database: option.database as string
        })
        const promise = promisify(this.conn.connect)
        await promise()
    }

}