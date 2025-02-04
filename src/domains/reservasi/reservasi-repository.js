import db from "../../utils/prisma.js"
import BaseRepository from "../../base_classes/base-repository.js";

class ReservasiRepository extends BaseRepository {
    constructor() {
        super({ 
            model: db.reservasi,
        });
    }

    async create(data) {
        let { deleted_at, ...filteredData} = data;

        return await super.create(filteredData);
    }

    async update(id, data) {
        let { deleted_at, ...filteredData} = data;

        return await super.update(id, filteredData);
    }

    async deleteWithRelation(id) {
        return await db.$transaction(async (tx) => {
            const reservasi = await tx.reservasi.update({
                where: {
                    id: id,
                },
                data: {
                    deleted_at: new Date(),
                    detail_reservasis: {
                        updateMany: {
                            where: {
                                reservasi_id: id,
                            },
                            data: {
                                deleted_at: new Date(),
                            },
                        },
                    },
                    orders: {
                        updateMany: {
                            where: {
                                reservasi_id: id,
                            },
                            data: {
                                deleted_at: new Date(),
                            },
                        },
                    },
                },
                include: {
                    orders : true
                }
            });

            const order = await tx.orderDetail.updateMany({
                where: {
                    order_id: reservasi.orders[0].id,
                },
                data: {
                    deleted_at: new Date(),
                }
            });

            return reservasi;
        })
    }

    async getByIdWithRelation(id){
        return await db.reservasi.findUnique({
            where: {
                id: id,
            },
            include: {
                detail_reservasis: {
                    include: {
                        table : true
                    }
                },
                orders: {
                    include: {
                        order_detail : {
                            include: {
                                menu : true
                            }
                        },
                        transaction: true
                    }
                },
            },
        });
    }
}

export default new ReservasiRepository();