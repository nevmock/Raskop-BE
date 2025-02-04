import BaseRoutes from '../../base_classes/base-routes.js';
import tryCatch from '../../utils/tryCatcher.js';
import TransactionController from './transaction-controller.js';
import validateCredentials from '../../middlewares/validate-credentials-middleware.js';
import { transactionSchema } from './transaction-schema.js';

class TransactionRoutes extends BaseRoutes {
    routes() {
        this.router.post('/notification', [
            tryCatch(TransactionController.notification)
        ]);
        this.router.post('/generate-payment', [
            validateCredentials(transactionSchema),
            tryCatch(TransactionController.create)
        ]);
    }
}

export default new TransactionRoutes().router;
