import {MongoClient} from "mongodb";
import {DataBaseOption} from "../../config/ConfigFile";
import {Connector} from "./connector";

export class MongoConnector extends Connector<MongoClient> {
    async close(): Promise<void> {
        await this.conn.close()
    }

    async connect(option: DataBaseOption): Promise<void> {
        this.conn = await MongoClient.connect(option.url as string)
    }
}