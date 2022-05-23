import {DataBaseOption} from "../../config/ConfigFile";


export interface IConnector<TConnection> {
    connect(option: DataBaseOption): Promise<void>
    close(): Promise<void>
    getConnection(): TConnection
}

export abstract class Connector<TConnection>
    implements IConnector<TConnection> {
    protected conn: TConnection
    abstract close(): Promise<void>;

    abstract connect(option: DataBaseOption): Promise<void>;

    getConnection(): TConnection {
        return this.conn
    }
}
