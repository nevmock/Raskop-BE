import OrderController from "./order-controller.js";
import BaseRoutes from "../../base_classes/base-routes.js";
import tryCatch from "../../utils/tryCatcher.js";
import { orderSchema } from "./order-schema.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";

class OrderRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [tryCatch(OrderController.index)]);

    this.router.post("/", [validateCredentials(orderSchema), tryCatch(OrderController.createOrUpdate)]);

    this.router.delete("/", [tryCatch(OrderController.delete)]);
  }
}

export default new OrderRoutes().router;
