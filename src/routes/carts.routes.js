import Router from "./router.js";
import { __dirname } from "../utils.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import {
  createOne,
  cartbyid,
  addProdToCart,
  removeQuantiyToProduct,
  deleteProdToCart,
  emptyCart,
  purchase,
} from "../controllers/cart.controller.js";

export default class CartRouter extends Router {
  constructor() {
    super();
  }
  init() {
    this.post(
      "/",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      createOne
    ); //
    this.get(
      "/:cid",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      cartbyid
    ); //
    this.post(
      "/product/:pid",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      addProdToCart
    ); //
    this.post(
      "/removeQuantity/:pid",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      removeQuantiyToProduct
    ); //
    this.delete(
      "/remove/:pid",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      deleteProdToCart
    ); //
    this.delete(
      "/empty/:cid",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      emptyCart
    ); //
    this.put(
      "/:cid",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT
    ); //
    this.post(
      "/:cid/purchase",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      purchase
    ); //
  }
}
