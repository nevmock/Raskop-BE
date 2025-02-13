import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import ReservasiRepository from "./detailReservasi-repository.js";
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
  }
  
  export default new ReservasiServices();