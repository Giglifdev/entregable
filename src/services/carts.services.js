import { CartManager, ProductManager } from "../dao/factory.js";
const cartManager = new CartManager();
import CartRepository from "../repositories/cart.repository.js";
const cartRepository = new CartRepository(cartManager);
import { newTiketService } from "../services/tickets.services.js";
import { updateProductService } from "./products.services.js";

import ProductRepository from "../repositories/products.repository.js";
const productManager = new ProductManager();
const productRepository = new ProductRepository(productManager);

const purchaseService = async (cid) => {
  const cart = await cartRepository.getCartProducts(cid);
  const cartUserOwner = await cartRepository.getCartsByID(cid);
  const email = cartUserOwner.userId.email;

  const productsOnStock = cart.productsCart.filter((cartItem) => {
    const product = cartItem.productID;
    const quantityInCart = cartItem.quantity;
    return quantityInCart <= product.stock;
  });

  const productsOffStock = cart.productsCart.filter((cartItem) => {
    const product = cartItem.productID;
    const quantityInCart = cartItem.quantity;
    return quantityInCart > product.stock;
  });

  for (const cartItem of productsOnStock) {
    const product = cartItem.productID;
    const quantityInCart = cartItem.quantity;

    const newStock = product.stock - quantityInCart;

    await updateProductService({ stock: newStock }, product._id);
  }

  if (productsOnStock.length !== 0 && productsOffStock.length === 0) {
    await cartRepository.emptyCart(cid);
    return await newTiketService(productsOnStock, email);
  } else if (productsOnStock.length === 0 && productsOffStock.length !== 0) {
    return productsOffStock;
  } else if (productsOnStock.length !== 0 && productsOffStock.length !== 0) {
    await cartRepository.emptyCart(cid);
    await cartRepository.updateCartArray(cid, productsOffStock);
    return await newTiketService(productsOnStock, email);
  }
};

const updateCartArrayService = async (cid, products) => {
  const newCartArray = await cartRepository.updateCartArray(cid, products);
  return newCartArray;
};

const createNewCart = async () => {
  const newCart = { productsCart: [] };
  await cartRepository.createCart(newCart);
};

const getCartsByID = async (cid) => {
  const cart = await cartRepository.getCartsByID(cid);
  return cart;
};

const getCartProducts = async (cid) => {
  const cart = await cartRepository.getCartProducts(cid);
  return cart;
};

const existProduct = async (pid, cid) => {
  const cartbyid = await cartRepository.getCartsByID(cid);
  const product = {
    productID: pid,
    quantity: 1,
  };
  const existProduct = cartbyid.productsCart.find((p) =>
    p.productID.equals(pid)
  );
  return existProduct;
};

const getProductsByIdService = async (id) => {
  const result = await productRepository.getProductsById(id);
  return result;
};

const addQuantiyToProduct = async (cid, product) => {
  const addQuantiy = await cartRepository.addQuantiyToProduct(cid, product);
};

const addProductCart = async (pid, cid) => {
  const product = {
    productID: pid,
    quantity: 1,
  };
  const addProduct = await cartRepository.addProductCart(cid, product);
};
const removeQuantiyService = async (cid, pid) => {
  const cartbyid = await cartRepository.getCartsByID(cid);
  const productToUpdate = cartbyid.productsCart.find((p) =>
    p.productID.equals(pid)
  );
  if (productToUpdate.quantity <= 1) {
    const removeProduct = await cartRepository.deleteCartProduct(cid, pid);
    return removeProduct;
  } else {
    const removeQuantiy = await cartRepository.removeQuantiyToProduct(cid, pid);
    return removeQuantiy;
  }
};

const removeProduct = async (cid, pid) => {
  const removeProduct = await cartRepository.deleteCartProduct(cid, pid);
};

const emptyCartService = async (cid) => {
  const deleteProduct = await cartRepository.emptyCart(cid);
};

export {
  createNewCart,
  getCartsByID,
  getCartProducts,
  existProduct,
  addQuantiyToProduct,
  addProductCart,
  removeQuantiyService,
  removeProduct,
  emptyCartService,
  purchaseService,
  updateCartArrayService,
  getProductsByIdService,
};
