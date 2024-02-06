import fs from "fs";
import { __dirname } from "../../utils.js";
import { v4 as uuidv4 } from "uuid";

export default class CartManager {
  constructor() {
    this.path = `${__dirname}/dao/fileManagers/files/carts.json`;
  }
  getCartsByID = async (cid) => {
    const data = await fs.promises.readFile(
      `${__dirname}/dao/fileManagers/files/carritos.json`,
      "utf-8"
    );
    const carts = JSON.parse(data);

    const cart = carts.find((c) => c._id === cid);

    if (cart) {
      const userData = await fs.promises.readFile(
        `${__dirname}/dao/fileManagers/files/users.json`,
        "utf-8"
      );
      const users = JSON.parse(userData);

      const user = users.find((u) => u._id === cart.userId);

      cart.userId = user;

      return cart;
    }

    return null;
  };

  getCartProducts = async (cid) => {
    const data = await fs.promises.readFile(
      `${__dirname}/dao/fileManagers/files/carritos.json`,
      "utf-8"
    );
    const carts = JSON.parse(data);

    const cart = carts.find((c) => c._id === cid);

    if (cart) {
      const detailedProducts = await Promise.all(
        cart.productsCart.map(async (product) => {
          const productData = await fs.promises.readFile(
            `${__dirname}/dao/fileManagers/files/Productos.json`,
            "utf-8"
          );
          const products = JSON.parse(productData);
          return products.find((p) => p._id === product.productID);
        })
      );

      cart.productsCart = detailedProducts;

      return cart;
    }

    return null;
  };

  getCarts = async () => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const carts = JSON.parse(data);
    return carts;
  };
  createCart = async (newCart) => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const carts = JSON.parse(data);
    newCart._id = uuidv4();
    carts.push(newCart);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(carts, null, 2),
      "utf-8"
    );
    return newCart;
  };
  deleteCartProduct = async (cid, pid) => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const carts = JSON.parse(data);

    const cartIndex = carts.findIndex((c) => c._id === cid);

    carts[cartIndex].productsCart = carts[cartIndex].productsCart.filter(
      (p) => p.productID !== pid
    );
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(carts, null, 2),
      "utf-8"
    );
  };
  addProductCart = async (cid, product) => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const carts = JSON.parse(data);

    const cartIndex = carts.findIndex((c) => c._id === cid);

    if (cartIndex !== -1) {
      carts[cartIndex].productsCart.push(product);

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(carts, null, 2),
        "utf-8"
      );
    }
  };

  addQuantiyToProduct = async (cid, product) => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const carts = JSON.parse(data);

    const cartIndex = carts.findIndex((c) => c._id === cid);

    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].productsCart.findIndex(
        (p) => p.productID === product.productID
      );

      if (productIndex !== -1) {
        carts[cartIndex].productsCart[productIndex].quantity += 1;

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(carts, null, 2),
          "utf-8"
        );
      }
    }
  };
  removeQuantityToProduct = async (cid, pid) => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const carts = JSON.parse(data);

    const cartIndex = carts.findIndex((c) => c._id === cid);

    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].productsCart.findIndex(
        (p) => p.productID === pid
      );

      if (productIndex !== -1) {
        carts[cartIndex].productsCart[productIndex].quantity -= 1;

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(carts, null, 2),
          "utf-8"
        );
      }
    }
  };
  updateCartArray = async (cid, products) => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const carts = JSON.parse(data);

    const cartIndex = carts.findIndex((c) => c._id === cid);

    if (cartIndex !== -1) {
      carts[cartIndex].productsCart.push(...products);

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(carts, null, 2),
        "utf-8"
      );
    }
  };
  updateQuantityToProduct = async (cid, pid, quantityValue) => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const carts = JSON.parse(data);

    const cartIndex = carts.findIndex((c) => c._id === cid);

    if (cartIndex !== -1) {
      const productIndex = carts[cartIndex].productsCart.findIndex(
        (p) => p.productID === pid
      );

      if (productIndex !== -1) {
        carts[cartIndex].productsCart[productIndex].quantity += quantityValue;

        await fs.promises.writeFile(
          this.path,
          JSON.stringify(carts, null, 2),
          "utf-8"
        );
        return carts[cartIndex];
      }
    }

    return null;
  };

  emptyCart = async (cid) => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const carts = JSON.parse(data);

    const cartIndex = carts.findIndex((c) => c._id === cid);

    if (cartIndex !== -1) {
      carts[cartIndex].productsCart = [];

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(carts, null, 2),
        "utf-8"
      );
      return carts[cartIndex];
    }

    return null;
  };
}
