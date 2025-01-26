import { createdResponse, successResponse } from '../../utils/response.js';
import TableServices from './table-services.js';

class TableController {

    async index(req, res) {
        let params = req.query;
    
        const { data, total } = await TableServices.getAll(params);
    
        return successResponse(res, data, total);
    }

    async show(req, res){
        const { id } = req.params;

        if (!id) {
            throw BaseError.badRequest("ID is required");
        }
    
        const table = await TableServices.getById(id);
    
        return successResponse(res, table);
    }
  
  
    async createOrUpdate(req, res) {
      let data = req.body;

      if (req.file){
        const imageUri = `/images/table/${req.file.filename}`;
        data.imageUri = imageUri;
      }
      
      if (data.id) {
        const table = await TableServices.update(data.id, data, req.file);
  
        return successResponse(res, table);
      }
      
      const table = await TableServices.create(data);
  
      return createdResponse(res, table);
    }
  
    async delete(req, res) {
      const { id, permanent } = req.query;
  
      if (permanent === true || permanent === "true") {
  
        await TableServices.deletePermanent(id);
  
        return successResponse(res, "Table deleted permanently");
      }
  
      await TableServices.delete(id);
  
      return successResponse(res, "Table deleted successfully");
    }
  
}

export default new TableController();
