import { createdResponse, successResponse } from "../../utils/response.js";

import OrderDetailService from "./orderDetail-services.js";
import { snakeCase } from "change-case";
import statusCodes from "../../errors/status-codes.js";

class orderDetailController {
  async index(req, res) {
    const orderDetails = await OrderDetailService.getAll();
    return successResponse(res, orderDetails.data, orderDetails.total);
  }

  async createOrUpdate(req, res) {
    const { id } = req.query;
    let result;

    if (id) {
      result = await OrderDetailService.update(id, req.body);
      return successResponse(res, result);
    }

    result = await OrderDetailService.create(req.body);
    return createdResponse(res, result);
  }

  async delete(req, res) {
    const { id, permanent } = req.query;

    if (permanent === true || permanent === "true") {
      await OrderDetailService.deletePermanent(id);

      return successResponse(res, "OrderDetail deleted permanently");
    }
    await OrderDetailService.delete(id);

    return successResponse(res, "OrderDetail deleted successfully");
  }
}

export default new orderDetailController();
