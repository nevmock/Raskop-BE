import SupplierController from './supplier-controller.js';
import BaseRoutes from '../../base_classes/base-routes.js';
import tryCatch from '../../utils/tryCatcher.js';

class SupplierRoutes extends BaseRoutes {
    routes() {
        this.router.get('/', [tryCatch(SupplierController.index)]);
        this.router.post('/', [tryCatch(SupplierController.create)]);
        // this.router.get('/:supplier_id', [tryCatch(SupplierController.show)]);
        // this.router.put('/:supplier_id', [tryCatch(SupplierController.update)]);
        // this.router.delete('/:supplier_id', [tryCatch(SupplierController.delete)]);
   }
}

export default new SupplierRoutes().router;