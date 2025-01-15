const _excluded = ["deleted_at"],
  _excluded2 = ["deleted_at"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
import db from "../../utils/prisma.js";
import BaseRepository from "../../base_classes/base-repository.js";
class MenuRepository extends BaseRepository {
  constructor() {
    super({
      model: db.menu
    });
  }
  async create(data) {
    let {
        deleted_at
      } = data,
      filteredData = _objectWithoutProperties(data, _excluded);
    this.toFloat(filteredData, ["price", "qty"]);
    this.toBoolean(filteredData, ["is_active"]);
    return await super.create(filteredData);
  }
  async update(id, data) {
    let {
        deleted_at
      } = data,
      filteredData = _objectWithoutProperties(data, _excluded2);
    this.toFloat(filteredData, ["price", "qty"]);
    this.toBoolean(filteredData, ["is_active"]);
    return await super.update(id, filteredData);
  }
}
export default new MenuRepository();