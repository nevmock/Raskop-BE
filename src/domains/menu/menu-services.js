import camelize from "camelize";
// import BaseError from "../../base_classes/base-error.js";
// import statusCodes from "../../errors/status-codes.js";
// import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import MenuRepository from "./menu-repository.js";

class MenuServices {
  constructor() {
    this.MenuRepository = MenuRepository;
  }

  getAll = async () => {
    let menus = await this.MenuRepository.get();

    menus = camelize(menus);

    return menus;
  };
}

export default new MenuServices();
