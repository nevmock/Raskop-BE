import ReservasiController from './reservasi-controller.js';
import BaseRoutes from '../../base_classes/base-routes.js';
import tryCatch from '../../utils/tryCatcher.js';
import { reservasiSchema } from './reservasi-schema.js';
import validateCredentials from '../../middlewares/validate-credentials-middleware.js';

class ReservasiRoutes extends BaseRoutes {
    routes() {
        this.router.get('/', [
            tryCatch(ReservasiController.index)
        ]);

        this.router.post('/', [
            validateCredentials(reservasiSchema), 
            tryCatch(ReservasiController.createOrUpdate)
        ]);

        this.router.delete('/', [
            tryCatch(ReservasiController.delete)
        ]);
    }
}

export default new ReservasiRoutes().router;
