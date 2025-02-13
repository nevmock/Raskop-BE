import ReservasiServices from "./reservasi-services.js";
import { createdResponse, successResponse } from "../../utils/response.js";

class ReservasiController {
  async index(req, res) {
    let params = req.query;
    
    const { data, total } = await ReservasiServices.getAll(params);

    return successResponse(res, data, total);
  }

  async show(req, res) {
    const { id } = req.params;

    const include = {
      include: {
        detail_reservasis: {
          include: {
            table: true
          }
        },
        orders: {
          include: {
            order_detail: {
              include: {
                menu: true
              }
            },
            transaction: true
          }
        }
      }
      
    }
    const reservasi = await ReservasiServices.getById(id, include);

    return successResponse(res, reservasi);
  }

  async create(req, res) {
    let data = req.body;
    
    const reservasi = await ReservasiServices.create(data);

    return createdResponse(res, reservasi);
  }

  async updateStatusReservasi(req, res) {
    const { id, status } = req.body;

    const reservasi = await ReservasiServices.updateStatusReservasi(id, status);

    return successResponse(res, "Reservasi status updated successfully");
  }

  async cancelReservasi(req, res) {
    const { id } = req.body;

    const reservasi = await ReservasiServices.cancelReservasi(id);

    return successResponse(res, "Reservasi Canceled successfully");
  }
}

export default new ReservasiController();