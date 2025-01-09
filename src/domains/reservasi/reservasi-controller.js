import ReservasiServices from "./reservasi-services.js";
import { createdResponse, successResponse } from "../../utils/response.js";
import statusCodes from "../../errors/status-codes.js";
import { snakeCase } from "change-case";

class SupplierController {
  async index(req, res) {
    let params = {};

    const {
        id,
        page = 1,
        limit = 10,
        search,
        sortBy = 'created_at',
        sortType = 'ASC',
        withDeleted = false,
        createdStart,
        createdEnd
    } = req.query;

    if (id) {
        params = {
            where: { id },
        };

        const reservasi = await ReservasiServices.getById(id, params);
        return successResponse(res, reservasi);
    }

    const filters = [
        { 
            reserveBy: { contains: search },
        },
        {
            community: { contains: search }
        },
        {
            phoneNumber: { contains: search },
        },
        {
            note: { contains: search },
        },
    ];

    params.where = {
        ...(search && {
            OR: filters
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

    if (withDeleted == 'false' || withDeleted == false) {
        params.where.deleted_at = null;
    }

    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    params.orderBy = {
        [snakeCase(sortBy)]: sortType.toLowerCase(),
    };

    params.skip = skip;
    params.take = take;

    console.log(params);

    const { data, total } = await ReservasiServices.getAll(params);

    return successResponse(res, data, total);
  }


  async createOrUpdate(req, res) {
    let data = req.body;
    
    if (data.id) {
      const reservasi = await ReservasiServices.update(data.id, data);

      return successResponse(res, reservasi);
    }
    
    const reservasi = await ReservasiServices.create(data);

    return createdResponse(res, reservasi);
  }

  async delete(req, res) {
    const { id, permanent } = req.query;

    if (permanent === true || permanent === "true") {
      console.log("coming here")
      await ReservasiServices.deletePermanent(id);

      return successResponse(res, "Reservasi deleted permanently");
    }
    // console.log("coming here")
    await ReservasiServices.delete(id);

    return successResponse(res, "Reservasi deleted successfully");
  }
}

export default new SupplierController();
