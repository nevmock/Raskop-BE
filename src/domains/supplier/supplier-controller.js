import SupplierServices from "./supplier-services.js";
import { createdResponse, successResponse } from "../../utils/response.js";

class SupplierController {
  async index(req, res) {
    let params = req.query;

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
