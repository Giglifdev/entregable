import { CartsModel } from "../dbManagers/models/carts.models.js";

export default class Carts {
  constructor() {
    console.log("Carts database operations are ready.");
  }

  getAll = async () => {
    const carts = await CartsModel.find().lean();
    return carts;
  };

  addCart = async (cart) => {
    const result = await CartsModel.create(cart);
    return result;
  };

  getById = async (id) => {
    const cart = await CartsModel.findById(id);
    return cart;
  };

  updateCart = async (id, product) => {
    const result = await CartsModel.updateOne({ _id: id }, product);
    return result;
  };

  updateProductQuantity = async (cartId, productId, newQuantity) => {
    try {
      const cart = await CartsModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (productIndex === -1) {
        throw new Error("Product not found in cart");
      }

      cart.products[productIndex].quantity = newQuantity;
      const result = await cart.save();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  deleteCart = async (id) => {
    const cart = await CartsModel.findByIdAndDelete(id);
    return cart;
  };

  deleteProduct = async (cid, pid) => {
    const result = await CartsModel.updateOne(
      { _id: cid },
      { $pull: { products: { product: pid } } }
    );
    return result;
  };

  deleteAllProducts = async (cartId) => {
    const cart = await CartsModel.findById(cartId);
    if (!cart) {
      throw new Error("Cart not found");
    }
    cart.products = [];
    const result = await cart.save();
    return result;
  };

  existCart = async (cartId) => {
    const cart = await CartsModel.findById(cartId);
    return !!cart;
  };
}
