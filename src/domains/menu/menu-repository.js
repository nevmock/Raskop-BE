import db from "../../utils/prisma.js";
import BaseRepository from "../../base_classes/base-repository.js";

class MenuRepository extends BaseRepository {
  constructor() {
    super({
      model: db.menu,
      params: {},
    });
  }
}

export default new MenuRepository();
