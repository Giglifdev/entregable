import Router from "./router.js";
import { __dirname } from "../utils.js";
import { accessRolesEnum, passportStrategiesEnum } from "../config/enums.js";
import {
  getcart,
  getproducts,
  loggers,
  passReset,
} from "../controllers/views.controller.js";

export default class ViewsRouter extends Router {
  constructor() {
    super();
  }
  init() {
    this.get(
      "/loggerTests",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      loggers
    );

    this.get(
      "/passreset/:jwt",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      passReset
    );

    this.get(
      "/login",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      async (req, res) => {
        res.render("login");
      }
    );

    this.get(
      "/register",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      async (req, res) => {
        res.render("register");
      }
    );

    this.get(
      "/recover",
      [accessRolesEnum.PUBLIC],
      passportStrategiesEnum.NOTHING,
      async (req, res) => {
        res.render("recoverPass");
      }
    );

    this.get(
      "/products",
      [accessRolesEnum.USER, accessRolesEnum.ADMIN, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      getproducts
    );

    this.get(
      "/chat",
      [accessRolesEnum.USER, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      async (req, res) => {
        return res.render("chat");
      }
    );

    this.get(
      "/cart",
      [accessRolesEnum.USER, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.JWT,
      getcart
    );

    this.get(
      "/",
      [accessRolesEnum.PUBLIC, accessRolesEnum.PREMIUM],
      passportStrategiesEnum.NOTHING,
      async (req, res) => {
        return res.redirect("/login");
      }
    );
  }
}
