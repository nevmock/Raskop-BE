import path from "path";
import fs from "fs";
import { __dirname, __filename } from "./path.js";
export const deleteFileIfExists = pathUri => {
  const filePath = path.join(__filename, `/public${pathUri}`);
  fs.unlink(filePath, unlinkError => {
    if (unlinkError) {
      console.error("Failed to delete file:", unlinkError);
    }
  });
};