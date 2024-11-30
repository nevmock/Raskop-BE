class BaseRepository {
    constructor({ model, params = {} }) {
        this.model = model;
        this.params = params;
    }

    async get(params = {}) {
        return this.model.findMany({
            where : {
                deletedAt: null,
            },
            ...params,
            ...this.params,
        });
    }

    async getWithTrashed(params = {}) {
        return this.model.findMany({
            ...params,
            ...this.params,
        });
    }
    
    async getById(id) {
        return this.model.findUnique({
            where: {
                id: id,
                deletedAt: null,
            },
            ...this.params,
        });
    }

    async getByIdWithTrashed(id) {
        return this.model.findUnique({
            where: {
                id: id,
            },
            ...this.params,
        });
    }

    async create(data) {
        return this.model.create(data);
    }
    
    async update(data) {
        return this.model.update(data);
    }
    
    async delete(id) {
        return this.model.delete(id);
    }
}

export default BaseRepository;