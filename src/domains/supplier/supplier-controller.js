import SupplierServices from "./supplier-services.js";
import { createdResponse, successResponse } from "../../utils/response.js";
import statusCodes from "../../errors/status-codes.js";

class SupplierController {
  async index(req, res) {
    const suppliers = await SupplierServices.getAll();

    successResponse(res, suppliers);
  }

  async createOrUpdate(req, res) {
    let data = req.body;
    
    if (data.id) {
      const supplier = await SupplierServices.update(data.id, data);

      successResponse(res, supplier);
    }
    
    const supplier = await SupplierServices.create(data);

    createdResponse(res, supplier);
  }
}

export default new SupplierController();
