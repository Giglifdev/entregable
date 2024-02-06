import { createHash, generateToken, isValidPassword } from "../utils.js";
import {
  findByEmailService,
  registerService,
  nonSensitiveService,
  updateRolService,
  recoverPassService,
  recoverPassInfoService,
  setNewPassService,
} from "../services/users.services.js";
import CustomErrors from "../middlewares/errors/customError.js";
import { EErrors } from "../config/enums.js";

const changePass = async (req, res) => {
  const email = req.body.email;
  const newPass = req.body.newPass;

  const user = await findByEmailService(email);
  if (isValidPassword(newPass, user.password)) {
    return res.status(409).send({
      status: "error",
      message: "The new password cannot be the same as the previous one",
    });
  }

  try {
    const result = await setNewPassService(newPass, email);

    console.log("password changed");
  } catch (error) {
    req.logger.fatal(error.message);
    res.sendServerError(error.message);
  }
};

const recoverPass = async (req, res) => {
  const email = req.body.email;

  const user = await recoverPassInfoService(email);

  if (!user) {
    return res.status(404).send({ status: "error", message: "user not found" });
  }
  try {
    const result = await recoverPassService(user);
    return result;
  } catch (error) {
    req.logger.fatal(error.message);
    res.sendServerError(error.message);
  }
};

const updateRol = async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await updateRolService(uid);
    return res.sendSuccess(result);
  } catch (error) {
    req.logger.fatal(error.message);
    res.sendServerError(error.message);
  }
};

const current = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await nonSensitiveService(email);
    return res.sendSuccess(user);
  } catch (error) {
    req.logger.fatal(error.message);
    res.sendServerError(error.message);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
  } catch (error) {
    req.logger.fatal(error.message);
    res.sendServerError(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findByEmailService(email);
    if (!user || !isValidPassword(password, user.password)) {
      req.logger.error("user not found or wrong password");
      throw CustomErrors.createError({
        name: "Credentials Error",
        cause: "user not found or wrong password",
        message: "Error when trying to log in",
        code: EErrors.CREDENTIALS_ERROR,
      });
    }
    delete user.password;
    const accessToken = generateToken(user);
    res
      .cookie("coderCookieToken", accessToken, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .send({ status: "success", message: "login success" });
  } catch (error) {
    req.logger.fatal(error.message);
    res.sendClientError(error.message);
  }
};
const register = async (req, res) => {
  try {
    const user = req.body;
    const { email, password } = req.body;
    const userExist = await findByEmailService(email);
    if (userExist) {
      req.logger.error("There is already a registered user with this email");
      throw CustomErrors.createError({
        name: "Existing user",
        cause: "An attempt was made to register an existing user",
        message: "There is already a registered user with this email",
        code: EErrors.CONFLICT_ERROR,
      });
    }

    //
    await registerService(user, email, password);

    res.status(201).send({ status: "success", message: "Registered user" });
  } catch (error) {
    req.logger.fatal(error.message);
    res.sendClientError(error.message);
  }
};

export { current, logout, login, register, updateRol, recoverPass, changePass };
