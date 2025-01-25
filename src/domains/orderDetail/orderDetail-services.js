import BaseError from "../../base_classes/base-error.js";
import OrderDetailRepository from "./orderDetail-repository.js";
import camelize from "camelize";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import statusCodes from "../../errors/status-codes.js";

class OrderDetailService {
  async getAll() {
    return await OrderDetailRepository.get();
  }

  async getById(id) {
    return await OrderDetailRepository.findById(id);
  }

  async create(data) {
    return await OrderDetailRepository.create(data);
  }

  async update(id, data) {
    return await OrderDetailRepository.update(id, data);
  }

  async delete(id) {
    return await OrderDetailRepository.softDelete(id);
  }
}

export default new OrderDetailService();
