import SupplierServices from "./supplier-services.js";
import statusCodes from "../../errors/status-codes.js";

class SupplierController {
  async index(req, res) {
    const suppliers = await SupplierServices.getAll();

    return res.status(200).json({
      code: 200,
      status: "OK",
      data: {
        suppliers,
      },
    });
  }

  async create(req, res) {
    let { name, contact, type, product_name, price, shipping_fee, address, unit, is_active } = req.body;
    is_active = is_active == 'true' ? true : false;
    price = parseFloat(price);
    shipping_fee = parseFloat(shipping_fee);
    let data = { name, contact, type, product_name, price, shipping_fee, address, unit, is_active };

    
    const supplier = await SupplierServices.create(data);

    return res.status(201).json({
      code: 201,
      status: "Created",
      data: {
        supplier,
      },
    });
  }
}

export default new SupplierController();
