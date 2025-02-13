import DetailReservasiServices from "./detailReservasi-services.js";
import { createdResponse, successResponse } from "../../utils/response.js";

class DetailReservasiController {
  async index(req, res) {
    let params = req.query;
    
    const { data, total } = await DetailReservasiServices.getAll(params);

    return successResponse(res, data, total);
  }

  async show(req, res) {
    const { id } = req.params;

    const include = {
      include: {
        reservasi: {
          include: {
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
      },
      table: true,
      }
      
    }
    const detailReservasi = await DetailReservasiServices.getById(id, include);

    return successResponse(res, detailReservasi);
  }
}

export default new DetailReservasiController();