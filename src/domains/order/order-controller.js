import OrderServices from "./order-services.js";
import { createdResponse, successResponse } from "../../utils/response.js";

class OrderController {
  async index(req, res) {
    let params = req.query;

    const { data, total } = await OrderServices.getAll(params);

    return successResponse(res, data, total);
  }

  async show(req, res) {
    const { id } = req.params;

    if (!id) {
      throw BaseError.badRequest("ID is required");
    }

    const order = await OrderServices.getById(id);

    return successResponse(res, order);
  }

  async createOrUpdate(req, res) {
    let data = req.body;

    if (data.id) {
      const order = await OrderServices.update(data.id, data);

      return successResponse(res, order);
    }

    const order = await OrderServices.create(data);

    return createdResponse(res, order);
  }

  async delete(req, res) {
    const { id, permanent } = req.query;

    if (permanent === true || permanent === "true") {
      await OrderServices.deletePermanent(id);

      return successResponse(res, "Order deleted permanently");
    }
    await OrderServices.delete(id);

    return successResponse(res, "Order deleted successfully");
  }
}

export default new OrderController();
