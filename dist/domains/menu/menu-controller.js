function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import MenuServices from "./menu-services.js";
import { createdResponse, successResponse } from "../../utils/response.js";
import { snakeCase } from "change-case";
import { __dirname } from "../../utils/path.js";
import { menuSchema } from "./menu-schema.js";
import { deleteFileIfExists } from "../../utils/delete-file.js";
class MenuController {
  async index(req, res) {
    let params = {};
    const {
      id,
      page = 1,
      limit = 10,
      search,
      sortBy = "created_at",
      sortType = "ASC",
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
      const supplier = await MenuServices.getById(id, params);
      return successResponse(res, supplier);
    }
    const filters = [{
      name: {
        contains: search
      }
    }, {
      product_name: {
        contains: search
      }
    }, {
      address: {
        contains: search
      }
    }, {
      contact: {
        contains: search
      }
    }];

    // if (!isNaN(Number(search))) {
    //     filters.push(
    //         { price: { equals: Number(search) } },
    //         { shipping_fee: { equals: Number(search) } }
    //     );
    // }

    // if (search.toLowerCase() === 'true' || search.toLowerCase() === 'false') {
    //     filters.push(
    //         { is_active: { equals: search.toLowerCase() === 'true' } }
    //     );
    // }

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
    if (withDeleted == "false" || withDeleted == false) {
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
    } = await MenuServices.getAll(params);
    return successResponse(res, data, total);
  }
  async createOrUpdate(req, res, next) {
    try {
      let data = req.body;
      const validated = menuSchema.validate(data, {
        abortEarly: false,
        errors: {
          wrap: {
            label: ""
          }
        },
        convert: true
      });
      if (validated.error) {
        next(validated.error);
      }
      if (req.file) {
        const imageUri = `/images/menu/${req.file.filename}`;
        data.imageUri = imageUri;
      }
      if (data.id) {
        const menu = await MenuServices.update(data.id, data, req.file);
        return successResponse(res, menu);
      }
      const menu = await MenuServices.create(data);
      return createdResponse(res, menu);
    } catch (err) {
      if (req.file) {
        deleteFileIfExists(req.file.filename);
      }
      next(err);
    }
  }
  async delete(req, res) {
    const {
      id,
      permanent
    } = req.query;
    if (permanent === true || permanent === "true") {
      await MenuServices.deletePermanent(id);
      return successResponse(res, "Menu deleted permanently");
    }
    await MenuServices.delete(id);
    return successResponse(res, "Menu deleted successfully");
  }
}
export default new MenuController();