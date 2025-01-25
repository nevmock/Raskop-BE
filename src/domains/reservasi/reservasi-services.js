import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import ReservasiRepository from "./reservasi-repository.js";
import TableRepository from "../table/table-repository.js";
import MenuRepository from "../menu/menu-repository.js";


class ReservasiServices {
    constructor() {
        this.ReservasiRepository = ReservasiRepository;
        this.TableRepository = TableRepository;
        this.MenuRepository = MenuRepository;
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

        const filters = {
            where,
            orderBy,
            skip: start - 1,
            take: length,
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
        data = convertKeysToSnakeCase(data);

        data.start = new Date(data.start);
        data.end = new Date(data.end);

        let minimumCapacity = 0;
        let dataDetailReservasi = [];
        for (const tableId of data.tables) {
            const table = await this.TableRepository.getById(tableId);
    
            if (!table || table.deleted_at) {
                throw BaseError.badRequest(`Table with id ${tableId} does not exist`);
            }
    
            minimumCapacity += table.min_capacity;

            dataDetailReservasi.push({
                table_id: table.id,
            });
        }

        let menuCount = 0;
        let dataOrders = {
            order_by: data.reserve_by,
            phone_number: data.phone_number,
            order_detail: {
                create: []
            }
        };
        
        for (const menuItem of data.menus) {
            const menu = await this.MenuRepository.getById(menuItem.id);
    
            if (!menu || menu.deleted_at) {
                throw BaseError.badRequest(`Menu with id ${menuItem.id} does not exist`);
            }
    
            menuCount += 1;

            dataOrders.order_detail.create.push({
                menu_id: menu.id,
                qty: menuItem.quantity,
                price: menu.price,
                note: menuItem.note
            });
        }

        data.detail_reservasis = {
            create : dataDetailReservasi
        };

        data.orders = {
            create : dataOrders
        };

        delete data.tables;
        delete data.menus;

        let reservasi = await this.ReservasiRepository.create(data);

        reservasi = camelize(reservasi);

        return reservasi;
    }

    update = async (id, data) => {
        const isExist = await this.ReservasiRepository.getById(id);
        if (!isExist) {
            throw BaseError.notFound("Reservasi does not exist");
        }
        data = convertKeysToSnakeCase(data)

        let reservasi = await this.ReservasiRepository.update(id, data);

        reservasi = camelize(reservasi);

        return reservasi;
    }

    delete = async (id) => {
        const params = {
            where: {
                deleted_at: null,
            },
        }

        const isExist = await this.ReservasiRepository.getById(id, params);

        if (!isExist) {
            throw BaseError.notFound("Reservasi does not exist");
        }

        await this.ReservasiRepository.delete(id);
    }

    deletePermanent = async (id) => {
        const isExist = await this.ReservasiRepository.getById(id);

        if (!isExist || isExist.deleted_at) {
            throw BaseError.notFound("Reservasi does not exist");
        }

        await this.ReservasiRepository.deletePermanent(id);
    }
  }
  
  export default new ReservasiServices();