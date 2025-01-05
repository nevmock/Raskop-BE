"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
require("dotenv/config");
var _apicache = _interopRequireDefault(require("apicache"));
var _compression = _interopRequireDefault(require("compression"));
var _cors = _interopRequireDefault(require("cors"));
var _errorHandlerMiddleware = _interopRequireDefault(require("./middlewares/error-handler-middleware.js"));
var _express = _interopRequireDefault(require("express"));
var _helmet = _interopRequireDefault(require("helmet"));
var _logger = _interopRequireDefault(require("./utils/logger.js"));
var _morgan = _interopRequireDefault(require("morgan"));
var _multer = _interopRequireDefault(require("multer"));
var _path = _interopRequireDefault(require("path"));
var _path2 = require("./utils/path.js");
var _supplierRoutes = _interopRequireDefault(require("./domains/supplier/supplier-routes.js"));
var _menuRoutes = _interopRequireDefault(require("./domains/menu/menu-routes.js"));
var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
var _swagger = _interopRequireDefault(require("./utils/swagger.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ExpressApplication = /*#__PURE__*/function () {
  function ExpressApplication(port) {
    _classCallCheck(this, ExpressApplication);
    _defineProperty(this, "app", void 0);
    _defineProperty(this, "fileStorage", void 0);
    _defineProperty(this, "fileFilter", void 0);
    this.app = (0, _express["default"])();
    this.port = port;
    this.app.use(_express["default"].json({
      type: "application/json"
    }));
    this.app.use(_express["default"].urlencoded({
      extended: false
    }));
    this.app.use((0, _cors["default"])());
    //  __init__
    this.configureAssets();
    this.setupRoute();
    this.setupMiddlewares([_errorHandlerMiddleware["default"], _express["default"].json(), _express["default"].urlencoded(), _apicache["default"].middleware("5 minutes")]);
    this.setupLibrary([process.env.NODE_ENV === "development" ? (0, _morgan["default"])("dev") : "", (0, _compression["default"])(), (0, _helmet["default"])()
    // cors(),
    ]);
    this.fileStorage = _multer["default"].diskStorage({
      destination: function destination(req, file, cb) {
        cb(null, "public/images");
      },
      filename: function filename(req, file, cb) {
        cb(null, new Date().getTime() + "-" + file.originalname);
      }
    });
    this.fileFilter = function (req, file, cb) {
      if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
      }
    };
    this.app.use((0, _multer["default"])({
      storage: this.fileStorage,
      fileFilter: this.fileFilter
    }).fields([{
      name: "profile_picture",
      maxCount: 1
    }]));
  }
  return _createClass(ExpressApplication, [{
    key: "setupMiddlewares",
    value: function setupMiddlewares(middlewaresArr) {
      var _this = this;
      middlewaresArr.forEach(function (middleware) {
        _this.app.use(middleware);
      });
    }
  }, {
    key: "setupRoute",
    value: function setupRoute() {
      this.app.use("/api/v1/menu", _menuRoutes["default"]);
      this.app.use("/api/v1/supplier", _supplierRoutes["default"]);
      this.app.use("/api-docs", _swaggerUiExpress["default"].serve, _swaggerUiExpress["default"].setup(_swagger["default"]));
    }
  }, {
    key: "configureAssets",
    value: function configureAssets() {
      this.app.use(_express["default"]["static"](_path["default"].join(_path2.__dirname, "../public")));
    }
  }, {
    key: "setupLibrary",
    value: function setupLibrary(libraries) {
      var _this2 = this;
      libraries.forEach(function (library) {
        if (library != "" && library != null) {
          _this2.app.use(library);
        }
      });
    }
  }, {
    key: "start",
    value: function start() {
      var _this3 = this;
      return this.app.listen(this.port, function () {
        _logger["default"].info("Application running on port ".concat(_this3.port));
      });
    }
  }]);
}();
var _default = exports["default"] = ExpressApplication;