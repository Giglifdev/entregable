import { productsModel } from "../dbManagers/models/products.model.js";
import { __dirname } from "../../utils.js";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }
  getProducts = async () => {
    const products = await productsModel.find().lean();
    return products;
  };
  addProduct = async (product) => {
    const addedProduct = await productsModel.create(product);
    return addedProduct;
  };
  getProductsById = async (id) => {
    const product = await productsModel.findOne({ _id: id });
    return product;
  };
  deleteProduct = async (id) => {
    const deleteProduct = await productsModel.findOneAndDelete({ _id: id });
    return deleteProduct;
  };
  deleteProductByPid = async (id) => {
    const deleteProduct = await productsModel.findOneAndDelete({ pid: id });
    return deleteProduct;
  };
  updateProduct = async (productToUpdate, id) => {
    const result = await productsModel.updateOne({ _id: id }, productToUpdate);
    return result;
  };
  productPaginate = async (page) => {
    const result = await productsModel.paginate(
      {},
      { limit: 4, page, lean: true }
    );
    return result;
  };
  productPaginate2 = async (filter, options) => {
    const result = await productsModel.paginate(filter, options);
    return result;
  };
}
