import MenuServices from "./menu-services.js";
import { createdResponse, successResponse } from "../../utils/response.js";
import { __dirname } from "../../utils/path.js";
import { menuSchema } from "./menu-schema.js";
import { deleteFileIfExists } from "../../utils/delete-file.js";
class MenuController {
  async index(req, res) {
    let params = req.query;
    const {
      data,
      total
    } = await MenuServices.getAll(params);
    return successResponse(res, data, total);
  }
  async show(req, res) {
    const {
      id
    } = req.params;
    const menu = await MenuServices.getById(id);
    return successResponse(res, menu);
  }
  async createOrUpdate(req, res, next) {
    try {
      let data = req.body;
      const validated = menuSchema.validate(data, {
        abortEarly: false,
        errors: {
          wrap: {
            label: ""
          }
        },
        convert: true
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
      } else {
        const menu = await MenuServices.create(data);
        return createdResponse(res, menu);
      }
    } catch (err) {
      if (req.file) {
        deleteFileIfExists(req.file.filename);
      }
      next(err);
    }
  }
  async delete(req, res) {
    const {
      id,
      permanent
    } = req.query;
    if (permanent === true || permanent === "true") {
      await MenuServices.deletePermanent(id);
      return successResponse(res, "Menu deleted permanently");
    }
    await MenuServices.delete(id);
    return successResponse(res, "Menu deleted successfully");
  }
}
export default new MenuController();