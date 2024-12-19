import MenuServices from "./menu-services.js";
import { createdResponse, successResponse } from "../../utils/response.js";

class MenuController {
  async index(req, res) {
    const menus = await MenuServices.getAll();

    successResponse(res, menus);
  }

  //   async createOrUpdate(req, res) {
  //     let data = req.body;

  //     if (data.id) {
  //       const menu = await MenuServices.update(data.id, data);

  //       successResponse(res, menu);
  //     }

  //     const menu = await MenuServices.create(data);

  //     createdResponse(res, menu);
  //   }
}

export default new MenuController();
