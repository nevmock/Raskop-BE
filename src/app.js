import "dotenv/config";

import { __dirname, __filename } from "./utils/path.js";

import apicache from "apicache";
import compression from "compression";
import cors from "cors";
import errorHandler from "./middlewares/error-handler-middleware.js";
import express from "express";
import helmet from "helmet";
import logger from "./utils/logger.js";
import menuRoutes from "./domains/menu/menu-routes.js";
import morgan from "morgan";
import multer from "multer";
import orderDetailRoutes from "./domains/orderDetail/orderDetail-routes.js";
import orderRoutes from "./domains/order/order-routes.js";
import path from "path";
import reservasiRoutes from "./domains/reservasi/reservasi-routes.js";
import supplierRoutes from "./domains/supplier/supplier-routes.js";
import swaggerSpec from "./utils/swagger.js";
import swaggerUi from "swagger-ui-express";
import tableRoutes from "./domains/table/table-routes.js";

class ExpressApplication {
  app;
  fileStorage;
  fileFilter;
  constructor(port) {
    this.app = express();
    this.port = port;

    this.app.use(express.json({ type: "application/json" }));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cors());
    //  __init__
    this.configureAssets();
    this.setupRoute();
    this.setupMiddlewares([
      errorHandler,
      express.json(),
      express.urlencoded(),
      apicache.middleware("5 minutes"),
    ]);
    this.setupLibrary([
      process.env.NODE_ENV === "development" ? morgan("dev") : "",
      compression(),
      helmet(),
      // cors(),
    ]);

    this.fileStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "public/images");
      },
      filename: (req, file, cb) => {
        cb(null, new Date().getTime() + "-" + file.originalname);
      },
    });
    this.fileFilter = (req, file, cb) => {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    };
    this.app.use(
      multer({
        storage: this.fileStorage,
        fileFilter: this.fileFilter,
      }).fields([
        {
          name: "profile_picture",
          maxCount: 1,
        },
        {
          name: "image",
          maxCount: 1,
        },
      ])
    );
  }

  setupMiddlewares(middlewaresArr) {
    middlewaresArr.forEach((middleware) => {
      this.app.use(middleware);
    });
  }
  setupRoute() {
    this.app.use("/api/v1/menu", menuRoutes);
    this.app.use("/api/v1/supplier", supplierRoutes);
    this.app.use("/api/v1/reservasi", reservasiRoutes);
    this.app.use("/api/v1/table", tableRoutes);
    this.app.use("/api/v1/order", orderRoutes);
    this.app.use("/api/v1/order-detail", orderDetailRoutes);

    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  configureAssets() {
    this.app.use(express.static(path.join(__filename, "public")));
  }

  setupLibrary(libraries) {
    libraries.forEach((library) => {
      if (library != "" && library != null) {
        this.app.use(library);
      }
    });
  }

  start() {
    return this.app.listen(this.port, () => {
      logger.info(`Application running on port ${this.port}`);
    });
  }
}

export default ExpressApplication;
