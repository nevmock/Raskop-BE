import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import ReservasiRepository from "./reservasi-repository.js";
import TableRepository from "../table/table-repository.js";
import MenuRepository from "../menu/menu-repository.js";
import TransactionServices from "../transaction/transaction-services.js";
import OrderRepository from "../order/order-repository.js";
import { snakeCase } from "change-case";


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
                ...((advSearch.withDeleted === "false" || advSearch.withDeleted === false) && { deleted_at: null }),
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

            let totalHours = Math.abs(data.end - data.start) / 36e5;

            if (totalHours < 4){
                throw BaseError.badRequest("Minimum reservation time is 4 hours");
            }

            let sumMinimumTableCapacity = 0;
            let dataDetailReservasi = [];

            data.tables = [... new Set(data.tables)];

            const tables = await tx.table.findMany({
                where: {
                    id: {
                        in: data.tables
                    },
                    is_active: true,
                    deleted_at: null
                }
            })

            if (tables.length != data.tables.length){
                throw BaseError.badRequest("Some tables are not active or does not exist");
            }

            for (const table of tables) {
                const bookedTable = await tx.detailReservasi.findMany({
                    where: {
                        table_id: table.id,
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
                    throw BaseError.badRequest(`Table with id ${table.id} is already booked`);       
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

            console.log(data.menus);
            // get the id on menus to array
            const menuIds = data.menus.map((menu) => {
                return menu.id;
            });

            const dataMenus = await tx.menu.findMany({
                where: {
                    id: {
                        in: menuIds
                    },
                    is_active: true,
                    deleted_at: null
                }
            });

            if (dataMenus.length != data.menus.length){
                throw BaseError.badRequest("Some menus are not active or does not exist");
            }

            for (const menu of data.menus) {
                const menuUpdate = await tx.menu.update({
                    where: {
                        id: menu.id,
                    },
                    data: {
                        qty: {
                            decrement: menu.quantity
                        }
                    }
                });

                if (menuUpdate.qty < 0){
                    throw BaseError.badRequest(`Quantity Menu with id ${menu.id} is out of stock`);
                }

                sumTotalMenu += menu.quantity;

                dataOrders.order_detail.create.push({
                    menu_id: menuUpdate.id,
                    qty: menu.quantity,
                    price: menuUpdate.price,
                    note: menu.note
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

            delete data.tables;
            delete data.menus;

            const paymentMethod = data.payment_method;

            delete data.payment_method;

            let reservasi = await tx.reservasi.create({
                data: data,
                include: {
                    orders: true
                }
            });

            if (!reservasi){
                throw Error("Failed to create reservasi");
            }

            let transaction = await this.TransactionServices.createMidtransTransaction(tx, reservasi.orders[0].id, paymentMethod);

            transaction.reservasiId = reservasi.id;

            return transaction;
        });
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