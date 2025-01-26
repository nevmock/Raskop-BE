import BaseRoutes from '../../base_classes/base-routes.js';
import tryCatch from '../../utils/tryCatcher.js';
import TableController from './table-controller.js';
import { tableSchema } from './table-schema.js';
import validateCredentials from '../../middlewares/validate-credentials-middleware.js';
import { createUploadMiddleware } from '../../middlewares/upload-middleware.js';

class TableRoutes extends BaseRoutes {
    routes() {
        this.router.get('/', [
            tryCatch(TableController.index)
        ]);

        this.router.post('/', [
            createUploadMiddleware('table'),
            validateCredentials(tableSchema),
            tryCatch(TableController.createOrUpdate)
        ]);

        this.router.delete('/', [
            tryCatch(TableController.delete)
        ]);
    }
}

export default new TableRoutes().router;
