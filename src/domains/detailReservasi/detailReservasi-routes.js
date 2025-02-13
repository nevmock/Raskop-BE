import DetailReservasiController from './detailReservasi-controller.js';
import BaseRoutes from '../../base_classes/base-routes.js';
import tryCatch from '../../utils/tryCatcher.js';

class DetailReservasiRoutes extends BaseRoutes {
    routes() {
        this.router.get('/', [
            tryCatch(DetailReservasiController.index)
        ]);

        this.router.get('/:id', [
            tryCatch(DetailReservasiController.show)
        ])
    }
}

export default new DetailReservasiRoutes().router;
