import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fakerES as faker } from "@faker-js/faker";
import config from "./config.js";
import winston from "winston";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __mainDirname = path.join(__dirname, "..");

const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (plainPassword, hashedPassword) =>
  bcrypt.compareSync(plainPassword, hashedPassword);

// LOGS

const ENVIROMENT = config.enviroment;
let logger;

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "yellow",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "gray",
  },
};

if (ENVIROMENT === "production") {
  logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.colorize({
            all: true,
            colors: customLevelOptions.colors,
          }),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({
        filename: "src/logs/errors.log",
        level: "info",
      }),
    ],
  });
} else {
  logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({
            all: true,
            colors: customLevelOptions.colors,
          }),
          winston.format.simple()
        ),
      }),
    ],
  });
}

const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.info(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
  next();
};

//JWT

const PRIVATE_KEY = "coder55575";

const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
  return token;
};

const generatePassToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" });
  return token;
};

const authotization = (role) => {
  return async (req, res, next) => {
    if (req.user.role !== role)
      return res.status(403).send({ status: "error", message: "Sin permisos" });
    next();
  };
};

const generateProducts = () => {
  return {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.number.int(),
    price: faker.commerce.price({ min: 50, max: 2000 }),
    stock: faker.number.int({ min: 0, max: 100 }),
    category: faker.commerce.productMaterial(),
    thumbnails: [],
    status: faker.datatype.boolean(),
    pid: faker.database.mongodbObjectId(),
  };
};

export {
  __dirname,
  createHash,
  isValidPassword,
  generateToken,
  PRIVATE_KEY,
  authotization,
  generateProducts,
  addLogger,
  generatePassToken,
  __mainDirname,
};
