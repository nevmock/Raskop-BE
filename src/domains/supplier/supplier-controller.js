import SupplierServices from "./supplier-services.js";
import { createdResponse, successResponse } from "../../utils/response.js";
import statusCodes from "../../errors/status-codes.js";
import { snakeCase } from "change-case";

class SupplierController {
  async index(req, res) {
    let params = {};

    // console.log(req.query);

    const {
        id,
        skip = 1,
        length = 10,
        search,
        advSearch = {},
        order = [],
        sortBy = 'created_at',
        sortType = 'ASC',
        withDeleted = false,
        createdStart,
        createdEnd
    } = req.query;

    let parsedOrder = [];
    if (Array.isArray(order)) {
        parsedOrder = order.map(o => JSON.parse(o));
    }

    if (id) {
        params = {
            where: { 
                id : id 
            },
        };

        const supplier = await SupplierServices.getById(id, params);
        return successResponse(res, supplier);
    }

    let filters = [];
    
    if (advSearch) {
        var parsedAdvSearch = JSON.parse(advSearch);
        for (const key in parsedAdvSearch) {
            if (parsedAdvSearch[key]) {
                filters.push({
                    [key]: { contains: parsedAdvSearch[key] },
                });
            }
        }
    }
    // console.log(filters);


    params.where = {
        ...(filters && {
            OR: {
                filters
            }
        }),
        ...(createdStart && {
            created_at: {
                gte: new Date(createdStart),
            },
        }),
        ...(createdEnd && {
            created_at: {
                lte: new Date(createdEnd),
            },
        }),
    };

    if (withDeleted === 'false' || withDeleted === false) {
        params.where.deleted_at = null;
    }
    if (Array.isArray(parsedOrder) && parsedOrder.length > 0) {
        params.orderBy = parsedOrder.map(item => ({
            [snakeCase(item.column)]: item.direction.toLowerCase(),
        }));
    } else {
        params.orderBy = {
            [snakeCase(sortBy)]: sortType.toLowerCase(),
        };
    }

    params.skip = skip;
    params.take = length;

    console.log(params);

    const { data, total } = await SupplierServices.getAll(params);

    return successResponse(res, data, total);
  }


  async createOrUpdate(req, res) {
    let data = req.body;
    
    if (data.id) {
      const supplier = await SupplierServices.update(data.id, data);

      return successResponse(res, supplier);
    }
    
    const supplier = await SupplierServices.create(data);

    return createdResponse(res, supplier);
  }

  async delete(req, res) {
    const { id, permanent } = req.query;

    if (permanent === true || permanent === "true") {
      console.log("coming here")
      await SupplierServices.deletePermanent(id);

      return successResponse(res, "Supplier deleted permanently");
    }
    // console.log("coming here")
    await SupplierServices.delete(id);

    return successResponse(res, "Supplier deleted successfully");
  }
}

export default new SupplierController();
