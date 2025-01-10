import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
import statusCodes from "../../errors/status-codes.js";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import ReservasiRepository from "./reservasi-repository.js";

class ReservasiServices {
    constructor() {
        this.ReservasiRepository = ReservasiRepository;
    }
    
    getAll = async (params = {}) => {
      let reservasis = await this.ReservasiRepository.get({
        ...params,
      });

      reservasis = camelize(reservasis);

      return reservasis;
    };

    getById = async (id, params = {}) => {
        let reservasi = await this.ReservasiRepository.getById(id, {
            ...params,
        });

        if (!reservasi) {
            throw BaseError.notFound("Reservasi does not exist");
        }
    
        reservasi = camelize(reservasi);
    
        return reservasi;
    };

    create = async (data) => {
      data = convertKeysToSnakeCase(data)

      let reservasi = await this.ReservasiRepository.create(data);

      reservasi = camelize(reservasi);

      return reservasi;
    }

    update = async (id, data) => {
        const isExist = await this.ReservasiRepository.getById(id);
        if (!isExist) {
            throw BaseError.notFound("Reservasi does not exist");
        }
        data = convertKeysToSnakeCase(data)

        let reservasi = await this.ReservasiRepository.update(id, data);

        reservasi = camelize(reservasi);

        return reservasi;
    }

    delete = async (id) => {
        const params = {
            where: {
                deleted_at: null,
            },
        }

        const isExist = await this.ReservasiRepository.getById(id, params);

        if (!isExist) {
            throw BaseError.notFound("Reservasi does not exist");
        }

        await this.ReservasiRepository.delete(id);
    }

    deletePermanent = async (id) => {
        
        const isExist = await this.ReservasiRepository.getById(id);

        if (!isExist || isExist.deleted_at) {
            throw BaseError.notFound("Reservasi does not exist");
        }

        await this.ReservasiRepository.deletePermanent(id);
    }
  
    // findById = async (reservasiId) => {
    //   const reservasi = await this.ReservasiRepository.getById(reservasiId);
  
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
  
  export default new ReservasiServices();