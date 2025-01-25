import BaseRepository from "../../base_classes/base-repository.js";
import db from "../../utils/prisma.js";

class orderDetailRepository extends BaseRepository {
  constructor() {
    console.info(db);
    super({
      model: db.orderDetail,
    });
  }

  async create(data) {
    let { deleted_at, ...filteredData } = data;

    return await super.create(filteredData);
  }

  async update(id, data) {
    let { deleted_at, ...filteredData } = data;

    return await super.update(id, filteredData);
  }
}

export default new orderDetailRepository();
