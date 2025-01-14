function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class BaseRepository {
  constructor({
    model
  }) {
    this.model = model;
  }
  async get(params = {}) {
    const data = await this.model.findMany(params ? _objectSpread({}, params) : undefined);
    const total = await this.model.count({
      where: params.where
    });
    return {
      data: data,
      total: total
    };
  }
  async getById(id, params = {}) {
    return this.model.findUnique({
      where: _objectSpread({
        id: id
      }, params.where)
    });
  }
  async create(data) {
    return this.model.create({
      data: data
    });
  }
  async update(id, data) {
    return this.model.update({
      where: {
        id: id
      },
      data: data
    });
  }
  async delete(id) {
    return this.model.update({
      where: {
        id: id
      },
      data: {
        deleted_at: new Date()
      }
    });
  }
  async deletePermanent(id) {
    return this.model.delete({
      where: {
        id: id
      }
    });
  }
  toFloat(data, dataKeys) {
    dataKeys.forEach(key => {
      data[key] = parseFloat(data[key]);
    });
  }
  toBoolean(data, dataKeys) {
    dataKeys.forEach(key => {
      data[key] = data[key] === 'true' || data[key] === true;
    });
  }

  // toInt(data, dataKeys) {
  //     dataKeys.forEach((key) => {
  //         data[key] = parseInt(data[key]);
  //     });
  // }
}
export default BaseRepository;