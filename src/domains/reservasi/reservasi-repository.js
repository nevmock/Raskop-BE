import db from "../../utils/prisma.js"
import BaseRepository from "../../base_classes/base-repository.js";

class ReservasiRepository extends BaseRepository {
    constructor() {
        super({ 
            model: db.supplier,
        });
    }

    async create(data) {
        let { deleted_at, ...filteredData} = data;

        return await super.create(filteredData);
    }

    async update(id, data) {
        let { deleted_at, ...filteredData} = data;

        return await super.update(id, filteredData);
    }
}

export default new ReservasiRepository();