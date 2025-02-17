import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import OrderRepository from "./order-repository.js";
import TransactionServices from "../transaction/transaction-services.js";

class OrderServices {
  constructor() {
    this.OrderRepository = OrderRepository;
    this.TransactionServices = TransactionServices;
  }

  async getAll(params = {}) {
    let { start = 1, length = 10, search = "", advSearch, order } = params;

    start = JSON.parse(start);
    length = JSON.parse(length);

    advSearch = advSearch ? JSON.parse(advSearch) : null;
    order = order ? JSON.parse(order) : null;

    let where = {
      ...(search && {
        OR: [{ order_by: { contains: search } }, { phone_number: { contains: search } }, { reservasi_id: { contains: search }}, { status: { contains: search }}],
      }),
      ...(advSearch && {
        ...(advSearch.orderBy && { order_by: { contains: advSearch.orderBy } }),
        ...(advSearch.phoneNumber && { phone_number: { contains: advSearch.phoneNumber } }),
        ...(advSearch.status && { status: { contains: advSearch.status } }),
        ...((advSearch.withDeleted === "false" || advSearch.withDeleted === false) && { deleted_at: { not: null } }),
        ...(advSearch.reservasiId && { reservasi_id: { contains: advSearch.reservasiId } }),
        ...((advSearch.withReservasi === "true" || advSearch.withReservasi === true) ? {} : { reservasi_id: null }),
        ...(advSearch.id && { id: { contains: advSearch.id } }),
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
      ...(advSearch && (advSearch.withRelation)) && {
        order_detail : {
          include: {
            menu : true
          }
        },
        transaction: true 
      }
    }
    
    const filters = {
      where,
      orderBy,
      skip: start - 1,
      take: length,
      include
    };

    // console.log(filters)

    let orders = await this.OrderRepository.get(filters);

    orders = camelize(orders);

    return orders;
  }

  getById = async (id, params = {}) => {
    let order = await this.OrderRepository.getById(id, {
      ...params,
    });

    if (!order) {
      throw BaseError.notFound("Order does not exist");
    }

    order = camelize(order);

    return order;
  };

  create = async (data) => {
    return await this.OrderRepository.withTransaction(async (tx) => {
      data = convertKeysToSnakeCase(data);

      let dataOrder = {
        order_by: data.order_by,
        phone_number: data.phone_number,
        order_detail: {
          create: []
        }
      }

      let menus = [];
      // object prisma 
      for (const menuItem of data.menus) {
          let menu = await tx.menu.findUnique({
              where: {
                  id: menuItem.id,
              }
          });
  
          if (!menu || menu.deleted_at) {
              throw BaseError.badRequest(`Menu with id ${menuItem.id} does not exist`);
          }

          if (!menu.is_active){
              throw BaseError.badRequest(`Menu with id ${menuItem.id} is not active`);
          }

          menu = await tx.menu.update({
              where: {
                  id: menuItem.id,
              },
              data: {
                  qty: {
                      decrement: menuItem.quantity
                  }
              }
          });

          if (menu.qty < 0){
              throw BaseError.badRequest(`Quantity Menu with id ${menuItem.id} is out of stock`);
          }

          let sumTotalMenu = 0

          sumTotalMenu += menuItem.quantity;

          dataOrder.order_detail.create.push({
              menu_id: menu.id,
              qty: menuItem.quantity,
              price: menu.price,
              note: menuItem.note
          });

          menus.push(menu);
      }

      dataOrder.status = "MENUNGGU_PEMBAYARAN";

      let paymentMethod = data.payment_method;

      console.log(paymentMethod);

      delete data.menus;
      delete data.payment_method;
      
      let order = await tx.order.create({
        data: dataOrder,
      })

      if (!order){
        throw BaseError.badRequest("Failed to create order");
      }

      let transaction = await this.TransactionServices.createMidtransTransaction(tx, order.id, paymentMethod)
  
      return transaction;
    });
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

    await this.OrderRepository.delete(id);
  };

  deletePermanent = async (id) => {
    const isExist = await this.OrderRepository.getById(id);

    if (!isExist || isExist.deleted_at) {
      throw BaseError.notFound("Order does not exist");
    }

    await this.OrderRepository.deletePermanent(id);
  };

  updateStatusOrder = async (id, status) => {
    const order = await this.OrderRepository.getByIdWithRelation(id);

    if (!order || order.deleted_at) {
        throw BaseError.notFound("Order does not exist");
    }

    if (order.status != "BELUM_DIBUAT" && order.status != "PROSES"){
        throw BaseError.badRequest("Order status cannot be updated");
    }

    const updatedOrder = await this.OrderRepository.update(order.id, { status : status });

    if (!updatedOrder){
        throw Error("Failed to update Order status");
    }

    return updatedOrder;
  }
}

export default new OrderServices();