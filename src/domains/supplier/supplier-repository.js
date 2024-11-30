import db from "../../utils/prisma.js"
import BaseRepository from "../../base_classes/base-repository.js";

class SupplierRepository extends BaseRepository {
    constructor() {
        super({ 
            model: db.supplier,
            params: {}
        });
        this.db = db;
    }
}

export default new SupplierRepository();