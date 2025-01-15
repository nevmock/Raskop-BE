import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
import statusCodes from "../../errors/status-codes.js";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import MenuRepository from "./menu-repository.js";
import { deleteFileIfExists } from "../../utils/delete-file.js";

class MenuServices {
  constructor() {
    this.MenuRepository = MenuRepository;
  }

  async getAll(params = {}) {
    let menus = await this.MenuRepository.get({
      ...params,
    });

    menus = camelize(menus);

    return menus;
  }

  getById = async (id, params = {}) => {
    let menu = await this.MenuRepository.getById(id, {
      ...params,
    });

    if (!menu) {
      throw BaseError.notFound("Menu does not exist");
    }

    menu = camelize(menu);

    return menu;
  };

  create = async (data) => {
    data = convertKeysToSnakeCase(data);

    let menu = await this.MenuRepository.create(data);

    menu = camelize(menu);

    return menu;
  };

  update = async (id, data, file) => {
    const isExist = await this.MenuRepository.getById(id);
    if (!isExist) {
      throw BaseError.notFound("Menu does not exist");
    }
    data = convertKeysToSnakeCase(data);

    if (file && isExist.image_uri) {
      deleteFileIfExists(isExist.image_uri);
    }

    let menu = await this.MenuRepository.update(id, data);

    menu = camelize(menu);

    return menu;
  };

  delete = async (id) => {
    const params = {
      where: {
        deleted_at: null,
      },
    };

    const isExist = await this.MenuRepository.getById(id, params);

    if (!isExist) {
      throw BaseError.notFound("Menu does not exist");
    }

    await this.MenuRepository.delete(id);
  };

  deletePermanent = async (id) => {
    const isExist = await this.MenuRepository.getById(id);

    if (!isExist || isExist.deleted_at) {
      throw BaseError.notFound("Menu does not exist");
    }

    if (isExist.image_uri) {
      deleteFileIfExists(isExist.image_uri);
    }

    await this.MenuRepository.deletePermanent(id);
  };
}

export default new MenuServices();
