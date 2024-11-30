class BaseRepository {
    constructor({ model, params = {} }) {
        this.model = model;
        this.params = params;
    }

    async get(params = {}) {
        return this.model.findMany({
            ...params,
            ...this.params,
        });
    }
    
    async getById(id, params = {}) {
        return this.model.findUnique({
            where: {
                id: id,
            },
            ...this.params,
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

    toFloat(data, dataKeys) {
        dataKeys.forEach((key) => {
            data[key] = parseFloat(data[key]);
        });
    }

    toBoolean(data, dataKeys) {
        dataKeys.forEach((key) => {
            data[key] = (data[key].toLowerCase() === 'true' || data[key] === true);
        });
    }
}

export default BaseRepository;