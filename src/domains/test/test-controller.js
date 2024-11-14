const TestService = require("./test-services");
const statusCodes = require("../../errors/status-codes");

class TestController {
  async index(req, res) {
    const tests = await TestService.getAll();

    // return res.send('Staging Test');
    return res.status(200).json({
      code: 200,
      status: "OK",
      data: {
        tests,
      },
    });
  }

  async create(req, res) {
    await TestService.create(req.body);

    return res.status(200).json({
      code: "SUCCESS_CREATE_TEST",
      status: "OK",
      data: {
        message: "Test created!",
      },
    });
  }

  async show(req, res) {
    const test = await TestService.findById(parseInt(req.params.test_id || ""));

    return res.status(200).json({
      code: 200,
      status: "OK",
      data: {
        test,
      },
    });
  }

  async updatePassword(req, res) {
    await TestService.updatePassword(parseInt(req.params.test_id), req.body.oldPassword, req.body.newPassword);

    return res.status(200).json({
      code: 200,
      status: "OK",
      data: {
        message: "Test password was update!",
      },
    });
  }

  async update(req, res) {
    const obj = JSON.parse(JSON.stringify({ ...req.files }));

    let data = {
      ...req.body,
    };

    if (obj.profile_picture) {
      data = {
        ...req.body,
        profile_picture: obj.profile_picture[0].filename.toString(),
      };
    }

    await TestService.update(parseInt(req.params.test_id), data);

    return res.status(200).json({
      code: 200,
      status: "OK",
      data: {
        message: "Test was update!",
      },
    });
  }

  async delete(req, res) {
    await TestService.delete(parseInt(req.params.test_id || ""));
    return res.status(200).json({
      code: 200,
      status: "OK",
      data: {
        message: "Test was deleted!",
      },
    });
  }
}

module.exports = new TestController();
