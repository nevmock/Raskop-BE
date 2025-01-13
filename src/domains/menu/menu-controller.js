import MenuServices from "./menu-services.js";
import { createdResponse, successResponse } from "../../utils/response.js";
import { snakeCase } from "change-case";
import { __dirname } from "../../utils/path.js";
import path from "path";
import fs from "fs";
import { menuSchema } from "./menu-schema.js";
import { deleteFileIfExists } from "../../utils/delete-file.js";

class MenuController {
  async index(req, res) {
    let params = {};

    const { id, page = 1, limit = 10, search, sortBy = "created_at", sortType = "ASC", withDeleted = false, createdStart, createdEnd } = req.query;

    if (id) {
      params = {
        where: { id },
      };

      const supplier = await MenuServices.getById(id, params);
      return successResponse(res, supplier);
    }

    const filters = [
      {
        name: { contains: search },
      },
      {
        product_name: { contains: search },
      },
      {
        address: { contains: search },
      },
      {
        contact: { contains: search },
      },
    ];

    // if (!isNaN(Number(search))) {
    //     filters.push(
    //         { price: { equals: Number(search) } },
    //         { shipping_fee: { equals: Number(search) } }
    //     );
    // }

    // if (search.toLowerCase() === 'true' || search.toLowerCase() === 'false') {
    //     filters.push(
    //         { is_active: { equals: search.toLowerCase() === 'true' } }
    //     );
    // }

    params.where = {
      ...(search && {
        OR: filters,
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

    if (withDeleted == "false" || withDeleted == false) {
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

    const { data, total } = await MenuServices.getAll(params);

    return successResponse(res, data, total);
  }

  async createOrUpdate(req, res, next) {
    try {
      let data = req.body;

      const validated = menuSchema.validate(data, {
        abortEarly: false,
        errors: {
          wrap: {
            label: "",
          },
        },
        convert: true,
      });

      if (validated.error) {
        next(validated.error);
      }

      if (req.file) {
        const imageUri = `/images/menu/${req.file.filename}`;
        data.imageUri = imageUri;
      }

      if (data.id) {
        const menu = await MenuServices.update(data.id, data, req.file);
        return successResponse(res, menu);
      }

      const menu = await MenuServices.create(data);
      return createdResponse(res, menu);
    } catch (err) {
      if (req.file) {
        deleteFileIfExists(req.file.filename);
      }
      next(err);
    }
  }

  async delete(req, res) {
    const { id, permanent } = req.query;

    if (permanent === true || permanent === "true") {
      await MenuServices.deletePermanent(id);

      return successResponse(res, "Menu deleted permanently");
    }
    await MenuServices.delete(id);

    return successResponse(res, "Menu deleted successfully");
  }
}

export default new MenuController();
