import Router from "./router.js";
import { __dirname } from "../utils.js";

import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import {
  getAll,
  getByID,
  createProduct,
  updateProduct,
  deleteProduct,
  mockProducts,
} from "../controllers/products.controller.js";

export default class ProductsRouter extends Router {
  constructor() {
    super();
  }

  init() {
    this.get(
      "/mockingproducts",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      mockProducts
    );

    this.get(
      "/",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      getAll
    );
    this.get(
      "/:id",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      getByID
    );
    this.post(
      "/",
      [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      createProduct
    );
    this.put(
      "/:id",
      [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      updateProduct
    );
    this.delete(
      "/:id",
      [accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      deleteProduct
    );
  }
}
