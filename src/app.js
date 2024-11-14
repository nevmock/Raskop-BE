const express = require("express");
const path = require("path");
const morgan = require("morgan");
const logger = require("./utils/logger");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const apicache = require("apicache");
const multer = require("multer");
const errorHandler = require("./middlewares/error-handler-middleware");

class ExpressApplication {
  app;
  fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, new Date().getTime() + "-" + file.originalname);
    },
  });
  fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  constructor(port) {
    this.app = express();
    this.port = port;
    this.app.use(express.json({ type: "application/json" }));
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(
      multer({
        storage: this.fileStorage,
        fileFilter: this.fileFilter,
      }).fields([
        {
          name: "profile_picture",
          maxCount: 1,
        },
      ])
    );
    this.app.use(cors());
    //  __init__
    this.configureAssets();
    //  this.setupRoute();
    this.setupMiddlewares([errorHandler, express.json(), express.urlencoded(), apicache.middleware("5 minutes")]);
    this.setupLibrary([
      process.env.NODE_ENV === "development" ? morgan("dev") : "",
      compression(),
      helmet(),
      // cors(),
    ]);
  }

  setupMiddlewares(middlewaresArr) {
    middlewaresArr.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  //   setupRoute() {
  //        this.app.use('/api/v1/auth', authRoutes);
  //        this.app.use('/api/v1/user', userRoutes);
  //        this.app.use('/api/v1/transfer', TransferRoutes);
  //        this.app.use('/api/v1/redeem', redeemRoutes);
  //   }

  configureAssets() {
    this.app.use(express.static(path.join(__dirname, "../public")));
  }

  setupLibrary(libraries) {
    libraries.forEach((library) => {
      this.app.use(library);
    });
  }

  start() {
    return this.app.listen(this.port, () => {
      logger.info(`Application running on port ${this.port}`);
    });
  }
}

module.exports = ExpressApplication;
