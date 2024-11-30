import SupplierController from './supplier-controller.js';
import BaseRoutes from '../../base_classes/base-routes.js';
import tryCatch from '../../utils/tryCatcher.js';
import { supplierSchema } from './supplier-schema.js';
import validateCredentials from '../../middlewares/validate-credentials-middleware.js';

class SupplierRoutes extends BaseRoutes {
    routes() {
        this.router.get('/', [
            tryCatch(SupplierController.index)
        ]);
        this.router.post('/', [
            validateCredentials(supplierSchema), 
            tryCatch(SupplierController.createOrUpdate)
        ]);
        // this.router.get('/:supplier_id', [tryCatch(SupplierController.show)]);
        // this.router.put('/:supplier_id', [tryCatch(SupplierController.update)]);
        // this.router.delete('/:supplier_id', [tryCatch(SupplierController.delete)]);
   }
}

export default new SupplierRoutes().router;