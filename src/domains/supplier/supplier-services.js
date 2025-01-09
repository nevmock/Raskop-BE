import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
import statusCodes from "../../errors/status-codes.js";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import SupplierRepository from "./supplier-repository.js";
import { snakeCase } from "change-case";

class SupplierServices {
    constructor() {
        this.SupplierRepository = SupplierRepository;
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
                    { name: { contains: search } },
                    { contact: { contains: search } },
                    { address: { contains: search } },
                    { product_name: { contains: search } },
                ],
            }),
            ...(advSearch && {
                ...(advSearch.contact && { contact: { contains: advSearch.contact } }),
                ...(advSearch.unit && { unit: advSearch.unit }),
                ...(advSearch.price && { price: advSearch.price }),
                ...(advSearch.name && { name: { contains: advSearch.name } }),
                ...(advSearch.isActive !== undefined && { is_active: advSearch.isActive }),
                ...((advSearch.withDeleted === "false" || advSearch.withDeleted === false) && { deleted_at: { not: null } }),
                ...(advSearch.address && { address: { contains: advSearch.address } }),
                ...(advSearch.shippingFee && { shipping_fee: advSearch.shippingFee }),
                ...(advSearch.productName && { product_name: { contains: advSearch.productName } }),
                ...(advSearch.type && { type: advSearch.type }),
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

        let suppliers = await this.SupplierRepository.get(filters);

        suppliers = camelize(suppliers);

        return suppliers;
    };

    getById = async (id, params = {}) => {
        let supplier = await this.SupplierRepository.getById(id, {
            ...params,
        });

        if (!supplier) {
            throw BaseError.notFound("Supplier does not exist");
        }
    
        supplier = camelize(supplier);
    
        return supplier;
    };

    create = async (data) => {
      data = convertKeysToSnakeCase(data)

      let supplier = await this.SupplierRepository.create(data);

      supplier = camelize(supplier);

      return supplier;
    }

    update = async (id, data) => {
        const isExist = await this.SupplierRepository.getById(id);
        if (!isExist) {
            throw BaseError.notFound("Supplier does not exist");
        }
        data = convertKeysToSnakeCase(data)

        let supplier = await this.SupplierRepository.update(id, data);

        supplier = camelize(supplier);

        return supplier;
    }

    delete = async (id) => {
        const params = {
            where: {
                deleted_at: null,
            },
        }

        const isExist = await this.SupplierRepository.getById(id, params);

        if (!isExist) {
            throw BaseError.notFound("Supplier does not exist");
        }

        await this.SupplierRepository.delete(id);
    }

    deletePermanent = async (id) => {
        
        const isExist = await this.SupplierRepository.getById(id);

        if (!isExist || isExist.deleted_at) {
            throw BaseError.notFound("Supplier does not exist");
        }

        await this.SupplierRepository.deletePermanent(id);
    }
  }
  
  export default new SupplierServices();