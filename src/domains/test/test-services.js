// import db from "../../models";

const statusCodes = require("../../errors/status-codes");
const BaseError = require("../../base_classes/base-error");

class TestServices {
  getAll = async () => {
    // const users = await db.Test.findAll({
    //   include: [
    //     {
    //       model: db.Wallet,
    //       as: "wallet",
    //       attributes: {
    //         exclude: ["createdAt", "updatedAt"],
    //       },
    //     },
    //   ],
    //   attributes: {
    //     exclude: ["password", "createdAt", "updatedAt", "wallet_id"],
    //   },
    // });

    // return users;
    return null;
  };

  findById = async (test_id) => {
    // const test = await db.Test.findOne({
    //   where: {
    //     id: test_id,
    //   },
    //   include: [
    //     {
    //       model: db.Wallet,
    //       as: "wallet",
    //       attributes: {
    //         exclude: ["createdAt", "updatedAt"],
    //       },
    //     },
    //   ],
    //   attributes: { exclude: ["password", "wallet_id", "updatedAt"] },
    // });

    // if (test === null) {
    //   throw new BaseError(400, statusCodes.NOT_FOUND.message, "Test Not Found");
    // }

    // return test;

    return null;
  };

  update = async (test_id, data) => {
    // const test = await db.Test.findOne({
    //   where: {
    //     id: test_id,
    //   },
    // });
    // if (!test) {
    //   throw new BaseError(400, statusCodes.BAD_REQUEST.message, "Test Does not exist");
    // }
    // await test.update(data);
  };

  delete = async (test_id) => {
    // const test = await db.Test.findOne({
    //   where: {
    //     id: test_id,
    //   },
    // });
    // if (!test) {
    //   throw new BaseError(400, statusCodes.BAD_REQUEST.message, "Test Does not exist");
    // }
    // await db.Test.destroy({
    //   where: {
    //     id: test_id,
    //   },
    // });
  };
}

module.exports = new TestServices();
