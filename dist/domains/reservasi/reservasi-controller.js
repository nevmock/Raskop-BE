function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import ReservasiServices from "./reservasi-services.js";
import { createdResponse, successResponse } from "../../utils/response.js";
import statusCodes from "../../errors/status-codes.js";
import { snakeCase } from "change-case";
class SupplierController {
  async index(req, res) {
    let params = {};
    const {
      id,
      page = 1,
      limit = 10,
      search,
      sortBy = 'created_at',
      sortType = 'ASC',
      withDeleted = false,
      createdStart,
      createdEnd
    } = req.query;
    if (id) {
      params = {
        where: {
          id
        }
      };
      const reservasi = await ReservasiServices.getById(id, params);
      return successResponse(res, reservasi);
    }
    const filters = [{
      reserveBy: {
        contains: search
      }
    }, {
      community: {
        contains: search
      }
    }, {
      phoneNumber: {
        contains: search
      }
    }, {
      note: {
        contains: search
      }
    }];
    params.where = _objectSpread(_objectSpread(_objectSpread({}, search && {
      OR: filters
    }), createdStart && {
      created_at: {
        gte: new Date(createdStart)
      }
    }), createdEnd && {
      created_at: {
        lte: new Date(createdEnd)
      }
    });
    if (withDeleted == 'false' || withDeleted == false) {
      params.where.deleted_at = null;
    }
    const skip = (page - 1) * limit;
    const take = parseInt(limit);
    params.orderBy = {
      [snakeCase(sortBy)]: sortType.toLowerCase()
    };
    params.skip = skip;
    params.take = take;
    console.log(params);
    const {
      data,
      total
    } = await ReservasiServices.getAll(params);
    return successResponse(res, data, total);
  }
  async createOrUpdate(req, res) {
    let data = req.body;
    if (data.id) {
      const reservasi = await ReservasiServices.update(data.id, data);
      return successResponse(res, reservasi);
    }
    const reservasi = await ReservasiServices.create(data);
    return createdResponse(res, reservasi);
  }
  async delete(req, res) {
    const {
      id,
      permanent
    } = req.query;
    if (permanent === true || permanent === "true") {
      console.log("coming here");
      await ReservasiServices.deletePermanent(id);
      return successResponse(res, "Reservasi deleted permanently");
    }
    // console.log("coming here")
    await ReservasiServices.delete(id);
    return successResponse(res, "Reservasi deleted successfully");
  }
}
export default new SupplierController();