import {PathLike} from 'fs'
import {ConfigKeyType, ConfigSection} from "./ConfigFile";

export interface IConfig<T extends ConfigKeyType> {
    loadConfigAsync(path: PathLike): Promise<this>
    loadConfigSync(path: PathLike): this
    getSectionAsync<K=any>(name: T): Promise<this>
    getSectionSync<K=any>(name: T): this
    getValue(): any
}

export class Config implements IConfig<string> {
    protected config: ConfigSection<string>
    protected cur: any
    getSectionAsync<K=any>(name: string): Promise<this> {
        return new Promise<this>((resolve, reject) => {
            this.cur = this.config[name] as K
            resolve(this)
        })
    }

    getValue() {
        return this.cur
    }

    getSectionSync<K=any>(name: string): this {
        this.cur = this.config[name] as K
        return this
    }

    async loadConfigAsync(path: PathLike): Promise<this> {
        this.config = await import(path as string) as ConfigSection<string>
        return this
    }

    loadConfigSync(path: PathLike): this {
        this.config = require(path as string) as ConfigSection<string>
        return this
    }
}