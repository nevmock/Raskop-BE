import db from "../../utils/prisma.js"
import BaseRepository from "../../base_classes/base-repository.js";

class DetailReservasiRepository extends BaseRepository {
    constructor() {
        super({ 
            model: db.detailReservasi,
        });
    }

    async getByIdWithRelation(id){
        return await db.detailReservasi.findUnique({
            where: {
                id: id,
            },
            include: {
                reservasi: {
                    include: {
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
                },
                table: true,
            },
        });
    }
}

export default new DetailReservasiRepository();