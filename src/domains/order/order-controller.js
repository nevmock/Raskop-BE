import OrderServices from "./order-services.js";
import { createdResponse, successResponse } from "../../utils/response.js";
import BaseError from "../../base_classes/base-error.js";

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

  async create(req, res) {
    let data = req.body;

    const order = await OrderServices.create(data);

    return createdResponse(res, order);
  }

  async updateStatusOrder(req, res) {
      const { id, status } = req.body;
  
      const order = await OrderServices.updateStatusOrder(id, status);
  
      return successResponse(res, "Order status updated successfully");
    }
}

export default new OrderController();
