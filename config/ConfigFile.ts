type ConfigKeyType = string | symbol | number
type DataBaseType = 'mysql' | 'mongo' | 'sqlserver' | 'postgres'

type DataBaseOption = {
    url: string | symbol,
    username?: string | symbol,
    password?: string | symbol
}

type DataBaseSection = Partial<Record<DataBaseType, DataBaseOption[]>>

type EnvironmentType = 'development' | 'staging' | 'production'

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

type EnvironmentSection = Partial<Record<EnvironmentType, EnvironmentOption>>

type ConfigOption = {
    env?: EnvironmentSection
}

type CustomOption<T extends ConfigKeyType> = Record<T,any>

export type ConfigSection<T extends ConfigKeyType> = Record<T,ConfigOption> | CustomOption<T>


