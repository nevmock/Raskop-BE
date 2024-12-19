import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
import statusCodes from "../../errors/status-codes.js";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import SupplierRepository from "./supplier-repository.js";

class SupplierServices {
    constructor() {
        this.SupplierRepository = SupplierRepository;
    }
    
    getAll = async (params = {}) => {
      let suppliers = await this.SupplierRepository.get({
        ...params,
      });

      suppliers = camelize(suppliers);

      return suppliers;
    };

    getById = async (id, params = {}) => {
        let supplier = await this.SupplierRepository.getById(id, {
            ...params,
        });

        if (!supplier) {
            throw BaseError.notFound("Supplier does not exist");
        }
    
        supplier = camelize(supplier);
    
        return supplier;
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

    delete = async (id) => {
        const params = {
            where: {
                deleted_at: null,
            },
        }

        const isExist = await this.SupplierRepository.getById(id, params);

        if (!isExist) {
            throw BaseError.notFound("Supplier does not exist");
        }

        await this.SupplierRepository.delete(id);
    }

    deletePermanent = async (id) => {
        
        const isExist = await this.SupplierRepository.getById(id);

        if (!isExist || isExist.deleted_at) {
            throw BaseError.notFound("Supplier does not exist");
        }

        await this.SupplierRepository.deletePermanent(id);
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