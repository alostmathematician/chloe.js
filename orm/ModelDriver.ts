import {IModel} from "./model/Model";

export class ModelDriver<ID,TSource> {
    protected model: IModel<ID, TSource, any, any, any, any>
    async deleteById(id: ID): Promise<boolean> {
        return await this.model.deleteById(id)

    }


    async deleteMany(query: TSource): Promise<boolean> {
        return await this.model.deleteMany(query)
    }

    async deleteOne(query: TSource): Promise<boolean> {
        return await this.model.deleteOne(query)
    }

    async findAll(): Promise<TSource[]> {
        return await this.model.findAll()
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
}