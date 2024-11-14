const Router = require("express");

class BaseRoutes {
  router;

  constructor() {
    this.router = Router();
  }
}

module.exports = BaseRoutes;
