import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
import statusCodes from "../../errors/status-codes.js";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import SupplierRepository from "./supplier-repository.js";

class SupplierServices {
    constructor() {
        this.SupplierRepository = SupplierRepository;
    }
    
    getAll = async () => {
      let suppliers = await this.SupplierRepository.get();

      suppliers = camelize(suppliers);

      return suppliers;
    };

    create = async (data) => {
      data = convertKeysToSnakeCase(data)

      let supplier = await this.SupplierRepository.create(data);

      supplier = camelize(supplier);

      return supplier;
    }

    update = async (id, data) => {
        const isExist = await this.SupplierRepository.getById(id);
        if (!isExist) {
            throw BaseError.notFound("Supplier does not exist");
        }
        data = convertKeysToSnakeCase(data)

        let supplier = await this.SupplierRepository.update(id, data);

        supplier = camelize(supplier);

        return supplier;
    }
  
    // findById = async (supplierId) => {
    //   const supplier = await this.SupplierRepository.getById(supplierId);
  
    //   return null;
    // };
  
    // update = async (test_id, data) => {
    //   // const test = await db.Test.findOne({
    //   //   where: {
    //   //     id: test_id,
    //   //   },
    //   // });
    //   // if (!test) {
    //   //   throw new BaseError(400, statusCodes.BAD_REQUEST.message, "Test Does not exist");
    //   // }
    //   // await test.update(data);
    // };
  
    // delete = async (test_id) => {
    //   // const test = await db.Test.findOne({
    //   //   where: {
    //   //     id: test_id,
    //   //   },
    //   // });
    //   // if (!test) {
    //   //   throw new BaseError(400, statusCodes.BAD_REQUEST.message, "Test Does not exist");
    //   // }
    //   // await db.Test.destroy({
    //   //   where: {
    //   //     id: test_id,
    //   //   },
    //   // });
    // };
  }
  
  export default new SupplierServices();