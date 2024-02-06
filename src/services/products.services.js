import { generateProducts } from "../utils.js";
import { ProductManager } from "../dao/factory.js";
import ProductRepository from "../repositories/products.repository.js";
const productManager = new ProductManager();
const productRepository = new ProductRepository(productManager);

const getMockProducts = async () => {
  let products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProducts());
  }
  return products;
};
const deleteProductService = async (id) => {
  const result = await productRepository.deleteProduct(id);
  return result;
};

const getProductsService = async (id) => {
  const result = await productRepository.getProducts(id);
  return result;
};

const getProductsByIdService = async (id) => {
  const result = await productRepository.getProductsById(id);
  return result;
};

const updateProductService = async (productToUpdate, id) => {
  const result = await productRepository.updateProduct(productToUpdate, id);
  return result;
};
const addProductService = async (userEmail, productCreated) => {
  if (productCreated.status !== "false") {
    productCreated.status = true;
  } else {
    productCreated.status = false;
  }

  productCreated.owner = userEmail;

  const result = await productRepository.addProduct(productCreated);
  return result;
};

const getAllPaginateService = async (limit, page, sort, query, queryvalue) => {
  const filter = {
    $or: [
      { category: { $regex: queryvalue || "", $options: "i" } },
      { stock: { $gte: Number(queryvalue) || 0 } },
    ],
  };

  const options = {
    limit: Number(limit) || 10,
    page: Number(page) || 1,
  };

  if (sort === "1" || sort === "-1") {
    options.sort = { price: Number(sort) };
  }

  const products = await productRepository.productPaginate2(filter, options);
  return products;
};

export {
  deleteProductService,
  getProductsService,
  getProductsByIdService,
  updateProductService,
  addProductService,
  getAllPaginateService,
  getMockProducts,
};
