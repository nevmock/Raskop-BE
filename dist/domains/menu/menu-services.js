function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
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
      search = "",
      advSearch,
      order
    } = params;
    start = JSON.parse(start);
    length = JSON.parse(length);
    advSearch = advSearch ? JSON.parse(advSearch) : null;
    order = order ? JSON.parse(order) : null;
    const where = _objectSpread(_objectSpread({}, search && {
      OR: [{
        name: {
          contains: search
        }
      }, {
        description: {
          contains: search
        }
      }, {
        category: {
          contains: search
        }
      }]
    }), advSearch && _objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread(_objectSpread({}, advSearch.id && {
      id: {
        contains: advSearch.id
      }
    }), advSearch.name && {
      name: {
        contains: advSearch.name
      }
    }), advSearch.price && {
      price: advSearch.price
    }), advSearch.description && {
      description: {
        contains: advSearch.description
      }
    }), advSearch.category && {
      category: {
        contains: advSearch.category
      }
    }), advSearch.qty && {
      qty: advSearch.qty
    }), advSearch.isActive !== undefined && {
      is_active: advSearch.isActive
    }), (advSearch.minQty || advSearch.maxQty) && {
      qty: _objectSpread(_objectSpread({}, advSearch.minQty && {
        gte: advSearch.minQty
      }), advSearch.maxQty && {
        lte: advSearch.maxQty
      })
    }), (advSearch.minPrice || advSearch.maxPrice) && {
      price: _objectSpread(_objectSpread({}, advSearch.minPrice && {
        gte: advSearch.minPrice
      }), advSearch.maxPrice && {
        lte: advSearch.maxPrice
      })
    }), (advSearch.withDeleted === "false" || advSearch.withDeleted === false) && {
      deleted_at: null
    }), (advSearch.startDate || advSearch.endDate) && {
      created_at: _objectSpread(_objectSpread({}, advSearch.startDate && {
        gte: new Date(advSearch.startDate)
      }), advSearch.endDate && {
        lte: new Date(advSearch.endDate)
      })
    }));
    const orderBy = Array.isArray(order) ? order.map(o => ({
      [snakeCase(o.column)]: o.direction.toLowerCase() === "asc" ? "asc" : "desc"
    })) : [];
    const filters = {
      where,
      orderBy,
      skip: start - 1,
      take: length
    };
    let menus = await this.MenuRepository.get(filters);
    menus = camelize(menus);
    return menus;
  }
  getById = async (id, params = {}) => {
    let menu = await this.MenuRepository.getById(id, _objectSpread({}, params));
    if (!menu) {
      throw BaseError.notFound("Menu does not exist");
    }
    menu = camelize(menu);
    return menu;
  };
  create = async data => {
    if (data.id) {
      throw BaseError.badRequest("Id is not allowed!");
    }
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
  delete = async id => {
    const params = {
      where: {
        deleted_at: null
      }
    };
    const isExist = await this.MenuRepository.getById(id, params);
    if (!isExist) {
      throw BaseError.notFound("Menu does not exist");
    }
    await this.MenuRepository.delete(id);
  };
  deletePermanent = async id => {
    const isExist = await this.MenuRepository.getById(id, {
      include: {
        order_details: true
      }
    });

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