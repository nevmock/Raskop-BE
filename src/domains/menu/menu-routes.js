import MenuController from "./menu-controller.js";
import BaseRoutes from "../../base_classes/base-routes.js";
import tryCatch from "../../utils/tryCatcher.js";
import { menuSchema } from "./menu-schema.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import { createUploadMiddleware } from "../../middlewares/upload-middleware.js";

class MenuRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [tryCatch(MenuController.index)]);
    this.router.post("/", [createUploadMiddleware("menu"), MenuController.createOrUpdate]);
    this.router.delete("/", [tryCatch(MenuController.delete)]);
  }
}

export default new MenuRoutes().router;
