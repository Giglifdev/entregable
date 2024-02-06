export default class CartRepository {
  constructor(CartDao) {
    this.CartDao = CartDao;
  }

  getCarts = async () => {
    const carts = await this.CartDao.getCarts();
    return carts;
  };
  getCartsByID = async (cid) => {
    const cart = await this.CartDao.getCartsByID(cid);
    return cart;
  };

  createCart = async (newCart) => {
    const cart = await this.CartDao.createCart(newCart);
    return cart;
  };

  getCartProducts = async (cid) => {
    const cart = await this.CartDao.getCartProducts(cid);
    return cart;
  };

  deleteCartProduct = async (cid, pid) => {
    const cart = await this.CartDao.deleteCartProduct(cid, pid);
    return cart;
  };

  addProductCart = async (cid, product) => {
    const cart = await this.CartDao.addProductCart(cid, product);
    return cart;
  };

  addQuantiyToProduct = async (cid, product) => {
    const cart = await this.CartDao.addQuantiyToProduct(cid, product);
    return cart;
  };
  removeQuantiyToProduct = async (cid, pid) => {
    const cart = await this.CartDao.removeQuantiyToProduct(cid, pid);
    return cart;
  };
  updateCartArray = async (cid, products) => {
    const cart = await this.CartDao.updateCartArray(cid, products);
    return cart;
  };
  updateQuantiyToProduct = async (cid, pid, quantityValue) => {
    const cart = await this.CartDao.updateQuantiyToProduct(
      cid,
      pid,
      quantityValue
    );
    return cart;
  };
  emptyCart = async (cid) => {
    const cart = await this.CartDao.emptyCart(cid);
    return cart;
  };
}
