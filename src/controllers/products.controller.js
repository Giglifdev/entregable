import { EErrors } from "../config/enums.js";
import CustomErrors from "../middlewares/errors/customError.js";
import {
  addProductService,
  deleteProductService,
  getAllPaginateService,
  getProductsByIdService,
  getProductsService,
  updateProductService,
  getMockProducts,
} from "../services/products.services.js";

const mockProducts = async (req, res) => {
  try {
    const result = await getMockProducts();
    res.send({
      status: "ok",
      counter: result.length,
      data: result,
    });
  } catch (error) {
    throw CustomErrors.createError({
      name: "Server error",
      cause: "server error",
      message:
        "When trying to obtain all the mocked products an internal error occurred on the server",
      code: EErrors.INTERNAL_SERVER_ERROR,
    });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await getProductsByIdService(id);
  const userRole = req.user.role;
  const userEmail = req.user.email;

  if (userRole === "premium" && userEmail != product.owner) {
    throw CustomErrors.createError({
      name: "You cannot delete this product",
      cause: "You are not the creator of this product",
      message:
        "Error when trying to delete a product that the user is not the creator of",
      code: EErrors.CONFLICT_ERROR,
    });
  }

  try {
    const result = await deleteProductService(id);
    if (!result) {
      throw CustomErrors.createError({
        name: "Product not found",
        cause: "No product found with that ID",
        message:
          "The product you are trying to delete is not found in the database",
        code: EErrors.PRODUCT_NOT_FOUND,
      });
    }

    const socketServer = req.app.get("socketio");
    return res.send(`The Product with the id ${id} was successfully removed`);
  } catch (error) {
    throw CustomErrors.createError({
      name: "Server Error",
      cause: "An error occurred on the server",
      message:
        "When trying to delete a product an internal error occurred on the server",
      code: EErrors.INTERNAL_SERVER_ERROR,
    });
  }
};

const updateProduct = async (req, res) => {
  const products = await getProductsService();
  const { id } = req.params;
  const productToUpdate = req.body;
  const existProduct = await getProductsByIdService(id);

  if (!existProduct) {
    throw CustomErrors.createError({
      name: "Product not found",
      cause: "No product found with that ID",
      message:
        "The product you are trying to update is not found in the database",
      code: EErrors.PRODUCT_NOT_FOUND,
    });
  }
  try {
    const result = await updateProductService(productToUpdate, id);
    return res.send(`The product with the id ${id} was successfully updated`);
  } catch (error) {
    throw CustomErrors.createError({
      name: "Server error",
      cause: "server error",
      message:
        "When trying to update a product an internal error occurred on the server",
      code: EErrors.INTERNAL_SERVER_ERROR,
    });
  }
};

const createProduct = async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    status,
  } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    throw CustomErrors.createError({
      name: "Incomplete values",
      cause: "Values ​​are missing when creating a product",
      message: "The product could not be created due to lack of values",
      code: EErrors.INVALID_TYPE_ERROR,
    });
  }

  const allProducts = await getProductsService();

  if (allProducts.some((p) => p.code === req.body.code)) {
    throw CustomErrors.createError({
      name: "Existing product",
      cause: "An attempt was made to register an existing product",
      message: "There is already a product with that code",
      code: EErrors.CONFLICT_ERROR,
    });
  }
  if (
    isNaN(req.body.price) ||
    req.body.price <= 0 ||
    isNaN(req.body.stock) ||
    req.body.stock <= 0
  ) {
    throw CustomErrors.createError({
      name: "incorrect values",
      cause: "There are incorrect values ​​when creating a product",
      message: "Price and stock must be valid numbers and greater than zero",
      code: EErrors.INVALID_TYPE_ERROR,
    });
  }

  const userEmail = req.user.email;
  const productCreated = req.body;

  try {
    const addedProduct = await addProductService(userEmail, productCreated);
    return res.send({ status: "success", message: "product created" });
  } catch (error) {
    throw CustomErrors.createError({
      name: "Server error",
      cause: "server error",
      message: error.message,
      code: EErrors.INTERNAL_SERVER_ERROR,
    });
  }
};

const getByID = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getProductsByIdService(id);
    if (!result)
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });
    res.send(result);
  } catch (error) {
    throw CustomErrors.createError({
      name: "server error",
      cause: "Server error",
      message:
        "When trying to obtain a product by its ID, an internal error occurred on the server",
      code: EErrors.INTERNAL_SERVER_ERROR,
    });
  }
};

const getAll = async (req, res) => {
  const { limit, page, sort, query, queryvalue } = req.query;

  try {
    const products = await getAllPaginateService(
      limit,
      page,
      sort,
      query,
      queryvalue
    );
    let prevLink = "";
    let nextLink = "";
    if (products.hasPrevPage) {
      prevLink = `localhost:8080/api/products?page=${products.prevPage}`;
    } else {
      prevLink = null;
    }

    if (products.hasNextPage) {
      nextLink = `localhost:8080/api/products?page=${products.nextPage}`;
    } else {
      nextLink = null;
    }

    return res.send({
      status: "success",
      payload: products,
      prevLink,
      nextLink,
    });
  } catch (error) {
    throw CustomErrors.createError({
      name: "Server Error",
      cause: "server error",
      message:
        "When trying to obtain all paginated products, an internal error occurred on the server",
      code: EErrors.INTERNAL_SERVER_ERROR,
    });
  }
};
export {
  getAll,
  getByID,
  createProduct,
  updateProduct,
  deleteProduct,
  mockProducts,
};
