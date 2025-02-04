import ReservasiController from './reservasi-controller.js';
import BaseRoutes from '../../base_classes/base-routes.js';
import tryCatch from '../../utils/tryCatcher.js';
import { reservasiSchema, updateStatusReservasiSchema, cancelReservasiSchema } from './reservasi-schema.js';
import validateCredentials from '../../middlewares/validate-credentials-middleware.js';

class ReservasiRoutes extends BaseRoutes {
    routes() {
        this.router.get('/', [
            tryCatch(ReservasiController.index)
        ]);

        this.router.get('/:id', [
            tryCatch(ReservasiController.show)
        ])

        this.router.post('/', [
            validateCredentials(reservasiSchema), 
            tryCatch(ReservasiController.create)
        ]);

        this.router.post('/:id/update-status', [
            validateCredentials(updateStatusReservasiSchema),
            tryCatch(ReservasiController.updateStatusReservasi)
        ])

        this.router.post('/:id/cancel', [
            validateCredentials(cancelReservasiSchema),
            tryCatch(ReservasiController.cancelReservasi)
        ])
    }
}

export default new ReservasiRoutes().router;
