function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
import statusCodes from "../../errors/status-codes.js";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import ReservasiRepository from "./reservasi-repository.js";
class ReservasiServices {
  constructor() {
    this.ReservasiRepository = ReservasiRepository;
  }
  getAll = async (params = {}) => {
    let reservasis = await this.ReservasiRepository.get(_objectSpread({}, params));
    reservasis = camelize(reservasis);
    return reservasis;
  };
  getById = async (id, params = {}) => {
    let reservasi = await this.ReservasiRepository.getById(id, _objectSpread({}, params));
    if (!reservasi) {
      throw BaseError.notFound("Reservasi does not exist");
    }
    reservasi = camelize(reservasi);
    return reservasi;
  };
  create = async data => {
    data = convertKeysToSnakeCase(data);
    let reservasi = await this.ReservasiRepository.create(data);
    reservasi = camelize(reservasi);
    return reservasi;
  };
  update = async (id, data) => {
    const isExist = await this.ReservasiRepository.getById(id);
    if (!isExist) {
      throw BaseError.notFound("Reservasi does not exist");
    }
    data = convertKeysToSnakeCase(data);
    let reservasi = await this.ReservasiRepository.update(id, data);
    reservasi = camelize(reservasi);
    return reservasi;
  };
  delete = async id => {
    const params = {
      where: {
        deleted_at: null
      }
    };
    const isExist = await this.ReservasiRepository.getById(id, params);
    if (!isExist) {
      throw BaseError.notFound("Reservasi does not exist");
    }
    await this.ReservasiRepository.delete(id);
  };
  deletePermanent = async id => {
    const isExist = await this.ReservasiRepository.getById(id);
    if (!isExist || isExist.deleted_at) {
      throw BaseError.notFound("Reservasi does not exist");
    }
    await this.ReservasiRepository.deletePermanent(id);
  };

  // findById = async (reservasiId) => {
  //   const reservasi = await this.ReservasiRepository.getById(reservasiId);

  //   return null;
  // };

  // update = async (test_id, data) => {
  //   // const test = await db.Test.findOne({
  //   //   where: {
  //   //     id: test_id,
  //   //   },
  //   // });
  //   // if (!test) {
  //   //   throw new BaseError(400, statusCodes.BAD_REQUEST.message, "Test Does not exist");
  //   // }
  //   // await test.update(data);
  // };

  // delete = async (test_id) => {
  //   // const test = await db.Test.findOne({
  //   //   where: {
  //   //     id: test_id,
  //   //   },
  //   // });
  //   // if (!test) {
  //   //   throw new BaseError(400, statusCodes.BAD_REQUEST.message, "Test Does not exist");
  //   // }
  //   // await db.Test.destroy({
  //   //   where: {
  //   //     id: test_id,
  //   //   },
  //   // });
  // };
}
export default new ReservasiServices();