interface MongoSchema {
    bsonType: string,
    required?: string[],
    properties?: Record<string,MongoSchema>,
    description?: string,
    enum?: any[],
    minimum?: number,
    maximum?: number
}

function typeMapping(func:Function) {
    switch (func.name) {
        case 'String':
            return 'string'
        case 'Number':
            return 'double'
        case 'Boolean':
            return 'bool'
        case  'Date':
            return 'date'
        case 'RegExp':
            return 'regex'
        case 'Symbol':
            return 'symbol'
        case 'Timestamp':
            return 'timestamp'
        case 'Binary':
            return 'binData'
        default:
            return 'object'
    }
}

