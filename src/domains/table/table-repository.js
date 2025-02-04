import db from "../../utils/prisma.js";
import BaseRepository from "../../base_classes/base-repository.js";

class TableRepository extends BaseRepository {
  constructor() {
    super({
      model: db.table,
    });
  }

  async create(data) {
    let { deleted_at, ...filteredData } = data;

    this.toInt(filteredData, ["min_capacity", "max_capacity"]);
    this.toBoolean(filteredData, ["is_active", "is_outdoor"]);

    return await super.create(filteredData);
  }

  async update(id, data) {
    let { deleted_at, ...filteredData } = data;

    this.toInt(filteredData, ["min_capacity", "max_capacity"]);
    this.toBoolean(filteredData, ["is_active", "is_outdoor"]);

    return await super.update(id, filteredData);
  }

  async getByNoTable(no_table) {
    return await this.model.findUnique({
      where: {
        no_table,
      },
    });
  }

  async findAllWithMergedAvailable(id) {
    const allTables = await this.model.findMany({
      select: {
        id: true,
        merged_available: true,
      },
    });

    return allTables.filter(
      (table) =>
        Array.isArray(table.merged_available) &&
        table.merged_available.length > 0 &&
        table.merged_available.includes(id)
    );
  }
}

export default new TableRepository();
