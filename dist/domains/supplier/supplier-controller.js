import SupplierServices from "./supplier-services.js";
import { createdResponse, successResponse } from "../../utils/response.js";
import BaseError from "../../base_classes/base-error.js";
class SupplierController {
  async index(req, res) {
    let params = req.query;
    const {
      data,
      total
    } = await SupplierServices.getAll(params);
    return successResponse(res, data, total);
  }
  async show(req, res) {
    const {
      id
    } = req.params;
    if (!id) {
      throw BaseError.badRequest("ID is required");
    }
    const supplier = await SupplierServices.getById(id);
    return successResponse(res, supplier);
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
    const {
      id,
      permanent
    } = req.query;
    if (permanent === true || permanent === "true") {
      await SupplierServices.deletePermanent(id);
      return successResponse(res, "Supplier deleted permanently");
    }
    await SupplierServices.delete(id);
    return successResponse(res, "Supplier deleted successfully");
  }
}
export default new SupplierController();