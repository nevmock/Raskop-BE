import OrderController from "./order-controller.js";
import BaseRoutes from "../../base_classes/base-routes.js";
import tryCatch from "../../utils/tryCatcher.js";
import { orderSchema, updateStatusOrderSchema } from "./order-schema.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";

class OrderRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [tryCatch(OrderController.index)]);

    this.router.get('/:id', [tryCatch(OrderController.show)]);

    this.router.post("/", [validateCredentials(orderSchema), tryCatch(OrderController.create)]);

    this.router.post('/:id/update-status', [
      validateCredentials(updateStatusOrderSchema),
      tryCatch(OrderController.updateStatusOrder)
    ])
  }
}

export default new OrderRoutes().router;
