import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import TableRepository from "./table-repository.js";
import { snakeCase } from "change-case";
import { deleteFileIfExists } from "../../utils/delete-file.js";

class TableServices {
  constructor() {
    this.TableRepository = TableRepository;
  }

  getAll = async (params = {}) => {
    let { start = 1, length = 10, search = "", advSearch, order } = params;

    start = JSON.parse(start);
    length = JSON.parse(length);

    advSearch = advSearch ? JSON.parse(advSearch) : null;
    order = order ? JSON.parse(order) : null;

    const where = {
      ...(search && {
        OR: [
          { barcode: { contains: search } },
          { no_table: { contains: search } },
          { description: { contains: search } },
        ],
      }),
      ...(advSearch && {
        ...(advSearch.id && { id: { contains: advSearch.id } }),
        ...(advSearch.minCapacity && { min_capacity: advSearch.minCapacity }),
        ...(advSearch.maxCapacity && { max_capacity: advSearch.maxCapacity }),
        ...(advSearch.description && { description: { contains: advSearch.description } }),
        ...(advSearch.noTable && { no_table: { contains: advSearch.noTable } }),
        ...(advSearch.isOutdoor !== undefined && { is_outdoor: advSearch.isOutdoor }),
        ...(advSearch.isActive !== undefined && { is_active: advSearch.isActive }),
        ...((advSearch.withDeleted === "false" || advSearch.withDeleted === false) && { deleted_at: null }),
        ...((advSearch.startDate || advSearch.endDate) && {
          created_at: {
            ...(advSearch.startDate && { gte: new Date(advSearch.startDate) }),
            ...(advSearch.endDate && { lte: new Date(advSearch.endDate) }),
          },
        }),
      }),
    };

    const orderBy = Array.isArray(order)
      ? order.map((o) => ({
          [snakeCase(o.column)]: o.direction.toLowerCase() === "asc" ? "asc" : "desc",
        }))
      : [];

    const filters = {
      where,
      orderBy,
      skip: start - 1,
      take: length,
    };

    let tables = await this.TableRepository.get(filters);

    tables = camelize(tables);

    return tables;
  };

  getById = async (id, params = {}) => {
    let table = await this.TableRepository.getById(id, {
      ...params,
    });

    if (!table) {
      throw BaseError.notFound("Table does not exist");
    }

    table = camelize(table);

    return table;
  };

  getByNoTable = async (noTable) => {
    let table = await this.TableRepository.getByNoTable(noTable);

    table = camelize(table);

    return table;
  };

  create = async (data) => {
    data = convertKeysToSnakeCase(data);

    const isNoTableExist = await this.TableRepository.getByNoTable(data.no_table);

    if (isNoTableExist) {
      deleteFileIfExists(data.image_uri);
      throw BaseError.badRequest("No Table already exist");
    }

    if (data.merged_available && data.merged_available.length > 0) {
      await Promise.all(
        data.merged_available.map(async (tableId) => {
          const isIdTableExist = await TableRepository.getById(tableId);
          if (!isIdTableExist) {
            deleteFileIfExists(data.image_uri);
            throw BaseError.badRequest(`Id Table ${tableId} does not exist`);
          }
        })
      );
    }

    let table = await this.TableRepository.create(data);

    if (data.merged_available && data.merged_available.length > 0) {
      await Promise.all(
        data.merged_available.map(async (tableId) => {
          const isIdTableExist = await TableRepository.getById(tableId);
          const mergedAvailable = isIdTableExist.merged_available || [];

          if (!mergedAvailable.includes(table.id)) {
            mergedAvailable.push(table.id);
            isIdTableExist.merged_available = mergedAvailable;
            await TableRepository.update(tableId, isIdTableExist);
          }
        })
      );
    }

    table = camelize(table);

    return table;
  };

  update = async (id, data, file) => {
    const isExist = await this.TableRepository.getById(id);

    if (!isExist) {
      throw BaseError.notFound("Table does not exist");
    }
    data = convertKeysToSnakeCase(data);

    const isNoTableExist = await this.TableRepository.getByNoTable(data.no_table);

    if (isNoTableExist && isNoTableExist.id !== id) {
      deleteFileIfExists(data.image_uri);
      throw BaseError.badRequest("No Table already exist");
    }

    if (data.merged_available) {
      if (data.merged_available.length > 0) {
        await Promise.all(
          data.merged_available.map(async (tableId) => {
            const isIdTableExist = await TableRepository.getById(tableId);
            if (!isIdTableExist) {
              deleteFileIfExists(data.image_uri);
              throw BaseError.badRequest(`Id Table ${tableId} does not exist`);
            } else {
              const mergedAvailable = isIdTableExist.merged_available || [];

              if (!mergedAvailable.includes(data.id)) {
                mergedAvailable.push(data.id);
                isIdTableExist.merged_available = mergedAvailable;
                await TableRepository.update(tableId, isIdTableExist);
              }
            }
          })
        );
      } else {
        const currentMergedAvailable = isExist.merged_available || [];
        for (const tableId of currentMergedAvailable) {
          const isIdTableExist = await TableRepository.getById(tableId);
          if (isIdTableExist) {
            const mergedAvailable = isIdTableExist.merged_available || [];
            const updatedMergedAvailable = mergedAvailable.filter((id) => id !== isExist.id);
            isIdTableExist.merged_available = updatedMergedAvailable;
            await TableRepository.update(tableId, isIdTableExist);
          }
        }
      }
    }

    if (file && isExist.image_uri) {
      deleteFileIfExists(isExist.image_uri);
    }

    let table = await this.TableRepository.update(id, data);

    table = camelize(table);

    return table;
  };

  delete = async (id) => {
    const params = {
      where: {
        deleted_at: null,
      },
    };

    const isExist = await this.TableRepository.getById(id, params);

    if (!isExist) {
      throw BaseError.notFound("Table does not exist");
    }

    await this.TableRepository.delete(id);
  };

  deletePermanent = async (id) => {
    const isExist = await this.TableRepository.getById(id, { include: { detail_reservasis: true } });

    if (!isExist) {
      throw BaseError.notFound("Table does not exist");
    }

    if (!isExist.deleted_at) {
      throw BaseError.badRequest("Table is not deleted yet");
    }

    if (isExist.detail_reservasis.length > 0) {
      throw BaseError.badRequest(
        "Table cannot be deleted permanently because there are reservasions that use this Table"
      );
    }

    const tablesUsingThisId = await this.TableRepository.findAllWithMergedAvailable(isExist.id);
    if (tablesUsingThisId.length > 0) {
      await Promise.all(
        tablesUsingThisId.map(async (table) => {
          const mergedAvailable = table.merged_available || [];
          const updatedMergedAvailable = mergedAvailable.filter((mergedId) => mergedId !== id);
          table.merged_available = updatedMergedAvailable;
          await this.TableRepository.update(table.id, table);
        })
      );
    }

    if (isExist.image_uri) {
      deleteFileIfExists(isExist.image_uri);
    }

    await this.TableRepository.deletePermanent(id);
  };

  suggestion = async (inputData) => {
    let { data } = await this.TableRepository.get();
    let tables = [];

    data.forEach((table) => {
      if (inputData.capacity >= table.min_capacity && inputData.capacity <= table.max_capacity) {
        tables.push(table);
      }
    });

    function findValidCombinations(data, capacity) {
      const result = new Set();

      function generateCombinations(current, remaining, currentMin, currentMax) {
        if (current.length >= 2 && currentMin <= capacity && capacity <= currentMax) {
          // Convert current array of objects to a sorted string representation for uniqueness
          const combination = JSON.stringify(current.sort((a, b) => a.id.localeCompare(b.id)));
          result.add(combination);
        }

        for (let i = 0; i < remaining.length; i++) {
          const next = remaining[i];
          if (current.some((item) => item.id === next.id)) continue; // Check if already included
          if (!current.every((item) => next.merged_available?.includes(item.id))) continue; // Check allowed combinations

          generateCombinations(
            [...current, next], // Add the entire object
            remaining.filter((_, index) => index > i), // Filter remaining
            currentMin + next.min_capacity,
            currentMax + next.max_capacity
          );
        }
      }

      for (let i = 0; i < data.length; i++) {
        generateCombinations(
          [data[i]],
          data.filter((_, index) => index !== i),
          data[i].min_capacity,
          data[i].max_capacity
        );
      }

      return Array.from(result).map((combination) => JSON.parse(combination));
    }

    const mergedTables = findValidCombinations(data, inputData.capacity);

    return {
      tables: tables,
      mergedTables: mergedTables,
    };
  };
}

export default new TableServices();
