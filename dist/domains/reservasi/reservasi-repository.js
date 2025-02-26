const _excluded = ["deleted_at"],
  _excluded2 = ["deleted_at"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
import db from "../../utils/prisma.js";
import BaseRepository from "../../base_classes/base-repository.js";
class ReservasiRepository extends BaseRepository {
  constructor() {
    super({
      model: db.reservasi
    });
  }
  async create(data) {
    let {
        deleted_at
      } = data,
      filteredData = _objectWithoutProperties(data, _excluded);
    return await super.create(filteredData);
  }
  async update(id, data) {
    let {
        deleted_at
      } = data,
      filteredData = _objectWithoutProperties(data, _excluded2);
    return await super.update(id, filteredData);
  }
  async deleteWithRelation(id) {
    return await db.$transaction(async tx => {
      const reservasi = await tx.reservasi.update({
        where: {
          id: id
        },
        data: {
          deleted_at: new Date(),
          detail_reservasis: {
            updateMany: {
              where: {
                reservasi_id: id
              },
              data: {
                deleted_at: new Date()
              }
            }
          },
          orders: {
            updateMany: {
              where: {
                reservasi_id: id
              },
              data: {
                deleted_at: new Date()
              }
            }
          }
        },
        include: {
          orders: true
        }
      });
      const order = await tx.orderDetail.updateMany({
        where: {
          order_id: reservasi.orders[0].id
        },
        data: {
          deleted_at: new Date()
        }
      });
      return reservasi;
    });
  }
  async getByIdWithRelation(id) {
    return await db.reservasi.findUnique({
      where: {
        id: id
      },
      include: {
        detail_reservasis: {
          include: {
            table: true
          }
        },
        orders: {
          include: {
            order_detail: {
              include: {
                menu: true
              }
            },
            transaction: true
          }
        }
      }
    });
  }
}
export default new ReservasiRepository();