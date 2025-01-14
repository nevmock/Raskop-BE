import { fileURLToPath } from "url";
import { resolve, dirname } from "path";

// Fallback untuk runtime yang tidak mendukung import.meta.url
export const __filename = (() => {
  try {
    return fileURLToPath(import.meta.url);
  } catch (error) {
    return resolve(process.cwd(), "server.js");
  }
})();

export const __dirname = dirname(__filename);
