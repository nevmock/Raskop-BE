import SupplierRepository from "./supplier-repository.js";

class SupplierServices {
    constructor() {
        this.SupplierRepository = SupplierRepository;
    }
    
    getAll = async () => {
      const suppliers = await this.SupplierRepository.get();

      return suppliers;
    };

    create = async (data) => {
      const supplier = await this.SupplierRepository.create({
        data : data
      });

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