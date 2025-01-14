import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

export const __dirname = (() => {
  try {
    return dirname(fileURLToPath(import.meta.url));
  } catch (error) {
    return process.cwd();
  }
})();
