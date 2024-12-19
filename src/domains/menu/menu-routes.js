import MenuController from "./menu-controller.js";
import BaseRoutes from "../../base_classes/base-routes.js";
import tryCatch from "../../utils/tryCatcher.js";
// import { menuSchema } from "./menu-schema.js";
// import validateCredentials from "../../middlewares/validate-credentials-middleware.js";

class MenuRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [tryCatch(MenuController.index)]);
    // this.router.post("/", [validateCredentials(menuSchema), tryCatch(MenuController.createOrUpdate)]);
    // this.router.get('/:menu_id', [tryCatch(MenuController.show)]);
    // this.router.put('/:menu_id', [tryCatch(MenuController.update)]);
    // this.router.delete('/:menu_id', [tryCatch(MenuController.delete)]);
  }
}

export default new MenuRoutes().router;
