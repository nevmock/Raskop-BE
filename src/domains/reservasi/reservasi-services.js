import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import ReservasiRepository from "./reservasi-repository.js";
import TableRepository from "../table/table-repository.js";
import MenuRepository from "../menu/menu-repository.js";
import TransactionServices from "../transaction/transaction-services.js";
import OrderRepository from "../order/order-repository.js";


class ReservasiServices {
    constructor() {
        this.ReservasiRepository = ReservasiRepository;
        this.TableRepository = TableRepository;
        this.MenuRepository = MenuRepository;
        this.TransactionServices = TransactionServices;
        this.OrderRepository = OrderRepository;
    }
    
    getAll = async (params = {}) => {
        let {
            start = 1,
            length = 10,
            search = '',
            advSearch,
            order,
        } = params;

        start = JSON.parse(start);
        length = JSON.parse(length);

        advSearch = (advSearch) ? JSON.parse(advSearch) : null;
        order = (order) ? JSON.parse(order) : null;

        const where = {
            ...(search && {
                OR: [
                    { reserve_by: { contains: search } },
                    { community: { contains: search } },
                    { phone_number: { contains: search } },
                    // { note: { contains: search } },
                ],
            }),
            ...(advSearch && {
                ...(advSearch.reserveBy && { reserve_by: { contains: advSearch.reserveBy } }),
                ...(advSearch.community && { community: advSearch.community }),
                ...(advSearch.phoneNumber && { phone_number: advSearch.phoneNumber }),
                ...(advSearch.note && { note: { contains: advSearch.note } }),
                ...((advSearch.withDeleted === "false" || advSearch.withDeleted === false) && { deleted_at: { not: null } }),
                ...(advSearch.id && { id: advSearch.id }),
                ...((advSearch.startDate || advSearch.endDate) && {
                    created_at: {
                        ...(advSearch.startDate && { gte: new Date(advSearch.startDate) }),
                        ...(advSearch.endDate && { lte: new Date(advSearch.endDate) }),
                    },
                }),
            }),
        };

        const orderBy = Array.isArray(order) ? order.map(o => ({
            [snakeCase(o.column)]: o.direction.toLowerCase() === 'asc' ? 'asc' : 'desc',
        })) : [];

        const include = {
            ...(advSearch && advSearch.withRelation) && {
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
            }
        }

        const filters = {
            where,
            orderBy,
            skip: start - 1,
            take: length,
            include
        };

        let reservasis = await this.ReservasiRepository.get(filters);

        reservasis = camelize(reservasis);

        return reservasis;
    };

    getById = async (id, params = {}) => {
        let reservasi = await this.ReservasiRepository.getById(id, {
            ...params,
        });

        if (!reservasi) {
            throw BaseError.notFound("Reservasi does not exist");
        }
    
        reservasi = camelize(reservasi);
    
        return reservasi;
    };

    create = async (data) => {
        return await this.ReservasiRepository.withTransaction(async (tx) => {
            data = convertKeysToSnakeCase(data);

            data.start = new Date(data.start);
            data.end = new Date(data.end);

            let sumMinimumTableCapacity = 0;
            let dataDetailReservasi = [];

            for (const tableId of data.tables) {
                const table = await tx.table.findUnique({
                    where: {
                        id: tableId,
                    }
                })
        
                if (!table || table.deleted_at) {
                    throw BaseError.badRequest(`Table with id ${tableId} does not exist`);
                }

                if (!table.is_active){
                    throw BaseError.badRequest(`Table with id ${tableId} is not active`);
                }

                const bookedTable = await tx.detailReservasi.findMany({
                    where: {
                        table_id: tableId,
                        reservasi: {
                            start: {
                                lte: data.end
                            },
                            end: {
                                gte: data.start
                            },
                            deleted_at: null
                        }
                    }
                })

                if (bookedTable.length > 0){
                    throw BaseError.badRequest(`Table with id ${tableId} is already booked`);       
                }

                sumMinimumTableCapacity += table.min_capacity;
    
                dataDetailReservasi.push({
                    table_id: table.id,
                });
            }

            let sumTotalMenu = 0;
            let dataOrders = {
                order_by: data.reserve_by,
                phone_number: data.phone_number,
                order_detail: {
                    create: []                  
                }
            };

            let menus = [];
            // object prisma 
            for (const menuItem of data.menus) {
                let menu = await tx.menu.findUnique({
                    where: {
                        id: menuItem.id,
                    }
                });
        
                if (!menu || menu.deleted_at) {
                    throw BaseError.badRequest(`Menu with id ${menuItem.id} does not exist`);
                }

                if (!menu.is_active){
                    throw BaseError.badRequest(`Menu with id ${menuItem.id} is not active`);
                }

                menu = await tx.menu.update({
                    where: {
                        id: menuItem.id,
                    },
                    data: {
                        qty: {
                            decrement: menuItem.quantity
                        }
                    }
                });

                if (menu.qty < 0){
                    throw BaseError.badRequest(`Quantity Menu with id ${menuItem.id} is out of stock`);
                }

                sumTotalMenu += menuItem.quantity;

                dataOrders.order_detail.create.push({
                    menu_id: menu.id,
                    qty: menuItem.quantity,
                    price: menu.price,
                    note: menuItem.note
                });

                menus.push(menu);
            }

            if (sumTotalMenu < sumMinimumTableCapacity){
                throw BaseError.badRequest(`Total menu must be more than or equal to total table capacity`);
            }

            data.detail_reservasis = {
                create : dataDetailReservasi
            };

            dataOrders.status = "MENUNGGU_PEMBAYARAN";

            data.orders = {
                create : dataOrders
            };

            let paymentMethod = data.payment_method;

            delete data.tables;
            delete data.menus;
            delete data.payment_method;

            // console.log(data)

            let reservasi = await tx.reservasi.create({
                data: data,
            });

            if (!reservasi){
                throw Error("Failed to create reservasi");
            }
        
            const order = await tx.order.findFirst({
                where: {
                    reservasi_id: reservasi.id,
                },
                select: {
                    id: true
                }
            });

            if (!order){
                throw Error("Failed to find order");
            }

            let transaction = await this.TransactionServices.createMidtransTransaction(tx, order.id, paymentMethod, data.half_payment);

            return transaction;
        })
        
    }

    updateStatusReservasi = async (id, status) => {
        const reservasi = await this.ReservasiRepository.getByIdWithRelation(id);

        if (!reservasi || reservasi.deleted_at) {
            throw BaseError.notFound("Reservasi does not exist");
        }

        if (reservasi.orders[0].status != "BELUM_DIBUAT" && reservasi.orders[0].status != "PROSES"){
            throw BaseError.badRequest("Reservasi status cannot be updated");
        }

        const updatedReservasi = await this.OrderRepository.update(reservasi.orders[0].id, { status : status });

        if (!updatedReservasi){
            throw Error("Failed to update reservasi status");
        }

        return updatedReservasi;
    }

    cancelReservasi = async (id) => {
        const reservasi = await this.ReservasiRepository.getByIdWithRelation(id);

        if (!reservasi || reservasi.deleted_at) {
            throw BaseError.notFound("Reservasi does not exist");
        }

        if (reservasi.orders[0].status != "MENUNGGU_PELUNASAN" && reservasi.orders[0].status != "BELUM_DIBUAT"){
            throw BaseError.badRequest("Reservasi cannot be cancelled");
        }

        const updatedReservasi = await this.OrderRepository.update(reservasi.orders[0].id, { status: "CANCELED" });

        if (!updatedReservasi){
            throw Error("Failed to cancel reservasi");
        }

        return updatedReservasi;
    }
  }
  
  export default new ReservasiServices();