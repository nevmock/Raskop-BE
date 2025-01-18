import ReservasiServices from "./reservasi-services.js";
import { createdResponse, successResponse } from "../../utils/response.js";

class ReservasiController {
  async index(req, res) {
    let params = req.query;
    
    const { data, total } = await ReservasiServices.getAll(params);

    return successResponse(res, data, total);
  }


  async createOrUpdate(req, res) {
    // return createdResponse(res, "test");
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

export default new ReservasiController();