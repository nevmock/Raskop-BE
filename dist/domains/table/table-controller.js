function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class TestController {
  async index(req, res) {
    const tests = await TestService.getAll();

    // return res.send('Staging Test');
    return res.status(200).json({
      code: 200,
      status: "OK",
      data: {
        tests
      }
    });
  }
  async create(req, res) {
    await TestService.create(req.body);
    return res.status(200).json({
      code: "SUCCESS_CREATE_TEST",
      status: "OK",
      data: {
        message: "Test created!"
      }
    });
  }
  async show(req, res) {
    const test = await TestService.findById(parseInt(req.params.test_id || ""));
    return res.status(200).json({
      code: 200,
      status: "OK",
      data: {
        test
      }
    });
  }
  async updatePassword(req, res) {
    await TestService.updatePassword(parseInt(req.params.test_id), req.body.oldPassword, req.body.newPassword);
    return res.status(200).json({
      code: 200,
      status: "OK",
      data: {
        message: "Test password was update!"
      }
    });
  }
  async update(req, res) {
    const obj = JSON.parse(JSON.stringify(_objectSpread({}, req.files)));
    let data = _objectSpread({}, req.body);
    if (obj.profile_picture) {
      data = _objectSpread(_objectSpread({}, req.body), {}, {
        profile_picture: obj.profile_picture[0].filename.toString()
      });
    }
    await TestService.update(parseInt(req.params.test_id), data);
    return res.status(200).json({
      code: 200,
      status: "OK",
      data: {
        message: "Test was update!"
      }
    });
  }
  async delete(req, res) {
    await TestService.delete(parseInt(req.params.test_id || ""));
    return res.status(200).json({
      code: 200,
      status: "OK",
      data: {
        message: "Test was deleted!"
      }
    });
  }
}
module.exports = new TestController();