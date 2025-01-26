import db from "../utils/prisma.js"

class BaseRepository {
    constructor({ model }) {
        this.model = model;
    }

    async withTransaction(actions) {
        const transaction = await db.$transaction(actions);

        return transaction;
    }

    async get(params = {}) {
        const data = await this.model.findMany(params ? {
            ...params
        } : undefined)

        const total = await this.model.count({
            where: params.where
        });

        return {
            data : data,
            total : total
        };
    }
    
    async getById(id, params = {}) {
        return this.model.findUnique({
            where: {
                id: id,
                ...params.where
            },
            include: {
                ...params.include
            }
        });
    }

    async create(data) {
        return this.model.create({
            data: data,
        });
    }
    
    async update(id, data) {
        return this.model.update({
            where: {
                id: id,
            },
            data: data,
        });
    }

    async delete(id) {
        return this.model.update({
            where: {
                id: id,
            },
            data: {
                deleted_at: new Date(),
            },
        });
    }

    async deletePermanent(id) {
        return this.model.delete({
            where: {
                id: id,
            },
        });
    }

    toFloat(data, dataKeys) {
        dataKeys.forEach((key) => {
            data[key] = parseFloat(data[key]);
        });
    }

    toInt(data, dataKeys) {
        dataKeys.forEach((key) => {
            data[key] = parseInt(data[key]);
        });
    }

    toBoolean(data, dataKeys) {
        dataKeys.forEach((key) => {
            data[key] = (data[key] === 'true' || data[key] === true);
        });
    }

    // toInt(data, dataKeys) {
    //     dataKeys.forEach((key) => {
    //         data[key] = parseInt(data[key]);
    //     });
    // }
}

export default BaseRepository;