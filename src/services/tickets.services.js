import TiketRepository from "../repositories/ticket.repository.js";
import { TiketManager } from "../dao/factory.js";
const tiketManager = new TiketManager();
const tiketRepository = new TiketRepository(tiketManager);
import { v4 as uuidv4 } from "uuid";

const newTiketService = async (productsOnStock, email) => {
  const dataTime = new Date();
  const code = uuidv4();
  const totalAmount = productsOnStock.reduce((acc, product) => {
    const price = product.productID.price;
    const quantity = product.quantity;
    acc += price * quantity;
    return acc;
  }, 0);
  const newTiket = {
    code: code,
    purchase_datatime: dataTime,
    amount: totalAmount,
    purchaser: email,
  };
  const createTiket = await tiketRepository.create(newTiket);
  return createTiket;
};
const getTiketService = async (id) => {
  const result = await tiketRepository.findById(id);
  return result;
};

const addToTiketService = async (cid) => {};

export { newTiketService, getTiketService, addToTiketService };
