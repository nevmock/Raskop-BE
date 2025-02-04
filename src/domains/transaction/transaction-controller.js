import { createdResponse, successResponse } from '../../utils/response.js';
import TransactionServices from './transaction-services.js';

class TransactionController {

    async notification(req, res) {
        const data = req.body;

        const response = await TransactionServices.trxNotif(data);

        return successResponse(res, response);
    }

    async create(req, res) {
        const data = req.body;

        const response = await TransactionServices.generatePayment(data);

        return createdResponse(res, response);
    }

    async cancel(req, res) {
        const { id } = req.params;
        const data = req.body;

        const response = await TransactionServices.update(id, data);

        return successResponse(res, response);
    }
}

export default new TransactionController();
