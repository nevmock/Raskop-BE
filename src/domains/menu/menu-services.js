import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
import statusCodes from "../../errors/status-codes.js";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import MenuRepository from "./menu-repository.js";
import { deleteFileIfExists } from "../../utils/delete-file.js";
import { snakeCase } from "change-case";

class MenuServices {
  constructor() {
    this.MenuRepository = MenuRepository;
  }

  async getAll(params = {}) {
    let {
      start = 1,
      length = 10,
      search = '',
      advSearch,
      order,
    } = params;

    start = JSON.parse(start);
    length = JSON.parse(length);

    advSearch = (advSearch) ? JSON.parse(advSearch) : null;
    order = (order) ? JSON.parse(order) : null;

    const where = {
        ...(search && {
            OR: [
                { name: { contains: search } },
                { description: { contains: search } },
                { category: { contains: search } },
            ],
        }),
        ...(advSearch && {
          ...(advSearch.id && { id: { contains: advSearch.id }}),
          ...(advSearch.name && { name: { contains: advSearch.name } }),
          ...(advSearch.price && { price: advSearch.price }),
          ...(advSearch.description && { description: { contains: advSearch.description } }),
          ...(advSearch.category && { category: { contains: advSearch.category } }),
          ...(advSearch.qty && { qty: advSearch.qty }),
          ...(advSearch.isActive !== undefined && { is_active: advSearch.isActive }),

          ...((advSearch.minQty || advSearch.maxQty) && {
            qty: {
                ...(advSearch.minQty && { gte: advSearch.minQty }),
                ...(advSearch.maxQty && { lte: advSearch.maxQty }),
            },
          }),

          ...((advSearch.minPrice || advSearch.maxPrice) && {
            price: {
                ...(advSearch.minPrice && { gte: advSearch.minPrice }),
                ...(advSearch.maxPrice && { lte: advSearch.maxPrice }),
            },
          }),


          ...((advSearch.withDeleted === "false" || advSearch.withDeleted === false) && { deleted_at: null }),
          ...((advSearch.startDate || advSearch.endDate) && {
              created_at: {
                  ...(advSearch.startDate && { gte: new Date(advSearch.startDate) }),
                  ...(advSearch.endDate && { lte: new Date(advSearch.endDate) }),
              },
          }),
        }),
    };

    const orderBy = Array.isArray(order) ? order.map(o => ({
        [snakeCase(o.column)]: o.direction.toLowerCase() === 'asc' ? 'asc' : 'desc',
    })) : [];

    const filters = {
        where,
        orderBy,
        skip: start - 1,
        take: length,
    };

    let menus = await this.MenuRepository.get(filters);

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

    data.price = parseFloat(data.price);
    data.qty = parseInt(data.qty);
    data.is_active = data.is_active === "true";

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
    const isExist = await this.MenuRepository.getById(id, { include : { order_details : true }});

    // console.log(isExist)

    if (!isExist) {
      throw BaseError.notFound("Menu does not exist");
    }

    if (!isExist.deleted_at) {
      throw BaseError.badRequest("Menu is not deleted yet");
    }

    if (isExist.order_details.length > 0) {
      throw BaseError.badRequest("Menu cannot be deleted permanently because there are orders that use this menu");
    }

    if (isExist.image_uri) {
      deleteFileIfExists(isExist.image_uri);
    }

    await this.MenuRepository.deletePermanent(id);
  };
}

export default new MenuServices();
