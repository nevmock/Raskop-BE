import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import TableRepository from "./table-repository.js";

class TableServices {
    constructor() {
        this.TableRepository = TableRepository;
    }

    getById = async (id, params = {}) => {
        let Table = await this.TableRepository.getById(id, {
            ...params,
        });

        if (!Table) {
            throw BaseError.notFound("Table does not exist");
        }
    
        Table = camelize(Table);
    
        return Table;
    };

    create = async (data) => {
        data = convertKeysToSnakeCase(data);

        let Table = await this.TableRepository.create(data);

        Table = camelize(Table);

        return Table;
    }

    update = async (id, data) => {
        const isExist = await this.TableRepository.getById(id);
        if (!isExist) {
            throw BaseError.notFound("Table does not exist");
        }
        data = convertKeysToSnakeCase(data)

        let Table = await this.TableRepository.update(id, data);

        Table = camelize(Table);

        return Table;
    }

    delete = async (id) => {
        const params = {
            where: {
                deleted_at: null,
            },
        }

        const isExist = await this.TableRepository.getById(id, params);

        if (!isExist) {
            throw BaseError.notFound("Table does not exist");
        }

        await this.TableRepository.delete(id);
    }

    deletePermanent = async (id) => {
        const isExist = await this.TableRepository.getById(id);

        if (!isExist || isExist.deleted_at) {
            throw BaseError.notFound("Table does not exist");
        }

        await this.TableRepository.deletePermanent(id);
    }
  }
  
  export default new TableServices();