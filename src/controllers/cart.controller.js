import {
  addProductCart,
  addQuantiyToProduct,
  createNewCart,
  existProduct,
  getCartProducts,
  getCartsByID,
  removeQuantiyService,
  removeProduct,
  emptyCartService,
  purchaseService,
  updateCartArrayService,
  getProductsByIdService,
} from "../services/carts.services.js";
const purchase = async (req, res) => {
  try {
    const { cid } = req.params;
    const cartbyid = await getCartsByID(cid);
    if (!cartbyid) {
      req.logger.error("cart not found");
      return res
        .status(400)
        .send({ status: "error", message: "cart not found" });
    }
    const purchase = await purchaseService(cid);
    res.send({ status: "success", payload: purchase });
  } catch (error) {
    req.logger.fatal(error.message);
    res.sendClientError(error.message);
  }
};

const createOne = async (req, res) => {
  try {
    await createNewCart();
    res.send({ status: "success", message: "cart not found" });
  } catch (error) {
    req.logger.fatal(error.message);
    res.sendClientError(error.message);
  }
};

const cartbyid = async (req, res) => {
  const { cid } = req.params;
  try {
    const cartbyid = await getCartsByID(cid);
    if (!cartbyid) {
      req.logger.error("the cart was not found");
      return res
        .status(400)
        .send({ status: "error", message: "the cart was not found" });
    } else {
      const cart = await getCartProducts(cid);
      return res.send({ status: "success", payload: cart });
    }
  } catch (error) {
    req.logger.fatal(error.message);
    res.sendClientError(error.message);
  }
};

const addProdToCart = async (req, res) => {
  const user = req.user;
  const cid = user.cart.id._id;
  const { pid } = req.params;
  const product = await getProductsByIdService(pid);

  if (user.role === "premium" && user.email === product.owner) {
    return res.status(409).send({
      status: "error",
      message: "You can't buy a product that you created yourself.",
    });
  }

  try {
    const cartbyid = await getCartsByID(cid);
    if (!cartbyid) {
      req.logger.error("cart not found");
      return res
        .status(400)
        .send({ status: "error", message: "cart not found" });
    }
    const existProductValue = await existProduct(pid, cid);
    if (existProductValue) {
      const addQuantiyValue = await addQuantiyToProduct(cid, existProductValue);
      return res.send({
        status: "success",
        message: " Updated Product Quantities",
      });
    }
    const addProduct = addProductCart(pid, cid);
    res.send({
      status: "success",
      message: `New product added to cart ${cid}`,
    });
  } catch (error) {
    req.logger.fatal(error.message);
    res.sendClientError(error.message);
  }
};
const removeQuantiyToProduct = async (req, res) => {
  const user = req.user;
  const cid = user.cart.id._id;
  const { pid } = req.params;
  try {
    const cartbyid = await getCartsByID(cid);
    if (!cartbyid) {
      req.logger.error("cart not found");
      return res
        .status(400)
        .send({ status: "error", message: "cart not found" });
    }
    const removeResult = await removeQuantiyService(cid, pid);
    return res.send({
      status: "success",
      message: " Updated Product Quantities",
    });
  } catch (error) {
    req.logger.fatal(error.message);
    res.sendClientError(error.message);
  }
};
const deleteProdToCart = async (req, res) => {
  const user = req.user;
  const cid = user.cart.id._id;
  const { pid } = req.params;
  try {
    const cartbyid = await getCartsByID(cid);
    if (!cartbyid) {
      req.logger.error("cart not found");
      return res
        .status(400)
        .send({ status: "error", message: "product not found" });
    }
    const removeResult = await removeProduct(cid, pid);
    return res.send({ status: "success", message: " product deleted" });
  } catch (error) {
    req.logger.fatal(error.message);
    res.sendClientError(error.message);
  }
};

const emptyCart = async (req, res) => {
  const { cid } = req.params;
  try {
    const cartbyid = await getCartsByID(cid);
    if (!cartbyid) {
      req.logger.error("cart not found");
      return res
        .status(400)
        .send({ status: "error", message: "cart not found" });
    }
    const deleteProduct = await emptyCartService(cid);
    res.send({ status: "success", message: `empty cart` });
  } catch (error) {
    req.logger.fatal(error.message);
    res.sendClientError(error.message);
  }
};

const updateCartArray = async (req, res) => {
  const { cid } = req.params;
  try {
    const cartbyid = await getCartsByID(cid);
    if (!cartbyid) {
      req.logger.error("cart not found");
      return res
        .status(400)
        .send({ status: "error", message: "cart not found" });
    }
    const updateArray = await updateCartArrayService(cid);
    res.send({
      status: "success",
      message: `update products`,
    });
  } catch (error) {
    req.logger.fatal(error.message);
    res.sendClientError(error.message);
  }
};

export {
  createOne,
  cartbyid,
  addProdToCart,
  removeQuantiyToProduct,
  deleteProdToCart,
  emptyCart,
  purchase,
  updateCartArray,
};
