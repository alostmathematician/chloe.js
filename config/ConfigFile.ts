export type ConfigKeyType = string | symbol | number
type DataBaseType = 'mysql' | 'mongo' | 'sqlserver' | 'postgres'

export type DataBaseOption = {
    url: string | symbol,
    username?: string | symbol,
    password?: string | symbol,
    database?: string | symbol
}

type DataBaseSection = Partial<Record<DataBaseType, DataBaseOption[]>>

type ServerSection = {
    url: string | symbol,
    port?: number
}

type LoggerPrefabType = 'common' | 'tiny'
type LoggerType = LoggerPrefabType | string

type LoggerSection = {
    use: boolean,
    style?: LoggerType
}

type EnvironmentOption = {
    database?: DataBaseSection,
    server?: ServerSection
    logger?: LoggerSection
}

type CustomOption<T extends ConfigKeyType> = Record<T,any>

export type ConfigSection<T extends ConfigKeyType> = EnvironmentOption | CustomOption<T>
