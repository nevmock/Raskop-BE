function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
    let menus = await this.MenuRepository.get(_objectSpread({}, params));
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