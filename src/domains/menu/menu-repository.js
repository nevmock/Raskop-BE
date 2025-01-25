import db from "../../utils/prisma.js";
import BaseRepository from "../../base_classes/base-repository.js";

class MenuRepository extends BaseRepository {
  constructor() {
    super({
      model: db.menu,
    });
  }

  async create(data) {
    let { deleted_at, ...filteredData } = data;

    this.toFloat(filteredData, ["price", "qty"]);
    this.toBoolean(filteredData, ["is_active"]);

    return await super.create(filteredData);
  }

  async update(id, data) {
    let { deleted_at, ...filteredData } = data;

    this.toFloat(filteredData, ["price", "qty"]);
    this.toBoolean(filteredData, ["is_active"]);

    return await super.update(id, filteredData);
  }
}

export default new MenuRepository();
