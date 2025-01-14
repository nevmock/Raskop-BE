import { snakeCase } from "change-case";
export const convertKeysToSnakeCase = data => {
  return Object.keys(data).reduce((acc, key) => {
    acc[snakeCase(key)] = data[key];
    return acc;
  }, {});
};