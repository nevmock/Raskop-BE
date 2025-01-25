import BaseRoutes from "../../base_classes/base-routes.js";
import orderDetailController from "./orderDetail-controller.js";
import { orderDetailSchema } from "./orderDetail-schema.js";
import tryCatch from "../../utils/tryCatcher.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";

class orderDetailRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [tryCatch(orderDetailController.index)]);

    this.router.post("/", [
      validateCredentials(orderDetailSchema),
      tryCatch(orderDetailController.createOrUpdate),
    ]);

    this.router.delete("/", [tryCatch(orderDetailController.delete)]);
  }
}

export default new orderDetailRoutes().router;
