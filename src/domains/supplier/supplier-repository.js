import db from "../../utils/prisma.js"
import BaseRepository from "../../base_classes/base-repository.js";

class SupplierRepository extends BaseRepository {
    constructor() {
        super({ 
            model: db.supplier,
        });
    }

    async create(data) {
        let { deleted_at, ...filteredData} = data;

        this.toFloat(filteredData, ['price', 'shipping_fee']);
        this.toBoolean(filteredData, ['is_active']);

        return await super.create(filteredData);
    }

    async update(id, data) {
        let { deleted_at, ...filteredData} = data;

        this.toFloat(filteredData, ['price', 'shipping_fee']);
        this.toBoolean(filteredData, ['is_active']);

        return await super.update(id, filteredData);
    }
}

export default new SupplierRepository();