import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import OrderRepository from "./order-repository.js";
import reservasiRepository from "../reservasi/reservasi-repository.js";
import { snakeCase } from "change-case";

class OrderServices {
  constructor() {
    this.OrderRepository = OrderRepository;
    this.ReservasiRepository = reservasiRepository;
  }

  async getAll(params = {}) {
    let { start = 1, length = 10, search = "", advSearch, order } = params;

    start = JSON.parse(start);
    length = JSON.parse(length);

    advSearch = advSearch ? JSON.parse(advSearch) : null;
    order = order ? JSON.parse(order) : null;

    const where = {
      ...(search && {
        OR: [{ order_by: { contains: search } }, { phone_number: { contains: search } }],
      }),
      ...(advSearch && {
        ...(advSearch.orderBy && { order_by: { contains: advSearch.orderBy } }),
        ...(advSearch.phoneNumber && { phone_number: advSearch.phoneNumber }),
        ...((advSearch.withDeleted === "false" || advSearch.withDeleted === false) && { deleted_at: { not: null } }),
        ...(advSearch.id && { id: advSearch.id }),
        ...(advSearch.status && { status: advSearch.status }),
        ...((advSearch.startDate || advSearch.endDate) && {
          created_at: {
            ...(advSearch.startDate && { gte: new Date(advSearch.startDate) }),
            ...(advSearch.endDate && { lte: new Date(advSearch.endDate) }),
          },
        }),
      }),
    };

    const orderBy = Array.isArray(order)
      ? order.map((o) => ({
          [snakeCase(o.column)]: o.direction.toLowerCase() === "asc" ? "asc" : "desc",
        }))
      : [];

    const include = {
      ...(advSearch &&
        advSearch.withRelation && {
          reservasi: {
            include: {
              detail_reservasis: {
                include: {
                  table: true,
                },
              },
            },
          },
          transaction: true,
          order_detail: {
            include: {
              menu: true,
            },
          },
        }),
    };

    const filters = {
      where,
      orderBy,
      skip: start - 1,
      take: length,
      include,
    };

    let orders = await this.OrderRepository.get(filters);

    orders = camelize(orders);

    return orders;
  }

  getById = async (id) => {
    let order = await this.OrderRepository.getByIdWithRelation(id);

    if (!order) {
      throw BaseError.notFound("Order does not exist");
    }

    order = camelize(order);

    return order;
  };

  create = async (data) => {
    if (data.id) {
      throw BaseError.badRequest("Id is not allowed!");
    }

    if (!data.status || (data.status && data.status.length === 0)) {
      data.status = "MENUNGGU_PEMBAYARAN";
    }

    if (data.reservasiId) {
      const isReservationExist = await this.ReservasiRepository.getById(data.reservasiId);

      if (!isReservationExist) {
        throw BaseError.notFound("Reservation does not exist");
      }
    }

    data = convertKeysToSnakeCase(data);

    let order = await this.OrderRepository.create(data);

    order = camelize(order);

    return order;
  };

  update = async (id, data) => {
    const isExist = await this.OrderRepository.getById(id);

    if (!isExist) {
      throw BaseError.notFound("Order does not exist");
    }

    if (data.reservasiId) {
      const isReservationExist = await this.ReservasiRepository.getById(data.reservasiId);

      if (!isReservationExist) {
        throw BaseError.notFound("Reservation does not exist");
      }
    }

    data = convertKeysToSnakeCase(data);

    let order = await this.OrderRepository.update(id, data);

    order = camelize(order);

    return order;
  };

  delete = async (id) => {
    const params = {
      where: {
        deleted_at: null,
      },
    };

    const isExist = await this.OrderRepository.getById(id, params);

    if (!isExist) {
      throw BaseError.notFound("Order does not exist");
    }

    await this.OrderRepository.deleteWithRelation(id);
  };

  deletePermanent = async (id) => {
    const isExist = await this.OrderRepository.getById(id);

    if (!isExist) {
      throw BaseError.notFound("Order does not exist");
    }

    if (!isExist.deleted_at) {
      throw BaseError.badRequest("Order is not deleted yet");
    }

    await this.OrderRepository.deletePermanent(id);
  };
}

export default new OrderServices();
