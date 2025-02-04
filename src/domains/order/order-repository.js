import db from "../../utils/prisma.js";
import BaseRepository from "../../base_classes/base-repository.js";

class OrderRepository extends BaseRepository {
  constructor() {
    super({
      model: db.order,
    });
  }

  async create(data) {
    let { deleted_at, ...filteredData } = data;

    return await super.create(filteredData);
  }

  async update(id, data) {
    let { deleted_at, ...filteredData } = data;

    return await super.update(id, filteredData);
  }

  async deleteWithRelation(id) {
    return await db.order.update({
      where: {
        id: id,
      },
      data: {
        deleted_at: new Date(),
        order_detail: {
          updateMany: {
            where: {
              order_id: id,
            },
            data: {
              deleted_at: new Date(),
            },
          },
        },
      },
    });
  }

  async getByIdWithRelation(id){
    return await db.order.findUnique({
      where: {
        id: id
      },
      include:{
          reservasi: {
            include : {
              detail_reservasis: {
                include: {
                    table : true
                }
              }
            }
          },
          transaction: true,
          order_detail : {
              include: {
                  menu : true
              }
          }, 
      }
    })
}
}

export default new OrderRepository();
