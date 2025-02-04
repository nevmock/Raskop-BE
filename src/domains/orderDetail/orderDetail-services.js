import BaseError from "../../base_classes/base-error.js";
import MenuRepository from "../menu/menu-repository.js";
import OrderDetailRepository from "./orderDetail-repository.js";
import OrderRepository from "../order/order-repository.js";
import camelize from "camelize";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import statusCodes from "../../errors/status-codes.js";

class OrderDetailService {
  constructor() {
    this.MenuRepository = MenuRepository;
    this.OrderRepository = OrderRepository;
    this.OrderDetailRepository = OrderDetailRepository;
  }

  async getAll() {
    return await this.OrderDetailRepository.get();
  }

  async getById(id) {
    return await this.OrderDetailRepository.findById(id);
  }

  async create(data) {
    const order_id = data.order_id;
    const menu_id = data.menu_id;

    if (order_id) {
      const order = await this.OrderRepository.getById(order_id);
      if (!order || order.deleted_at) {
        throw BaseError.badRequest(`Order with id ${order_id} does not exist`);
      }
    } else {
      throw BaseError.badRequest(`Order id does not exist`);
    }
    if (menu_id) {
      const menu = await this.MenuRepository.getById(menu_id);
      if (!menu || menu.deleted_at) {
        throw BaseError.badRequest(`Menu with id ${menu_id} does not exist`);
      }
    } else {
      throw BaseError.badRequest(`Menu id does not exist`);
    }

    return await this.OrderDetailRepository.create(data);
  }

  async update(id, data) {
    const order_id = data.order_id;
    const menu_id = data.menu_id;

    if (order_id) {
      const order = await this.OrderRepository.getById(order_id);
      if (!order || order.deleted_at) {
        throw BaseError.badRequest(`Order with id ${order_id} does not exist`);
      }
    } else {
      throw BaseError.badRequest(`Order id does not exist`);
    }
    if (menu_id) {
      const menu = await this.MenuRepository.getById(menu_id);
      if (!menu || menu.deleted_at) {
        throw BaseError.badRequest(`Menu with id ${menu_id} does not exist`);
      }
    } else {
      throw BaseError.badRequest(`Menu id does not exist`);
    }
    return await this.OrderDetailRepository.update(id, data);
  }

  delete = async (id) => {
    const params = {
      where: {
        deleted_at: null,
      },
    };

    const isExist = await this.OrderDetailRepository.getById(id, params);

    if (!isExist) {
      throw BaseError.notFound("OrderDetail does not exist");
    }

    await this.OrderDetailRepository.delete(id);
  };

  deletePermanent = async (id) => {
    const isExist = await this.OrderDetailRepository.getById(id);

    if (!isExist || isExist.deleted_at) {
      throw BaseError.notFound("OrderDetail does not exist");
    }

    await this.OrderDetailRepository.deletePermanent(id);
  };
}

export default new OrderDetailService();
