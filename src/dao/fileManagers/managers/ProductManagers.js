import fs from "fs";
import { __dirname } from "../../utils.js";
import { v4 as uuidv4 } from "uuid";

export default class ProductManager {
  constructor() {
    this.path = `${__dirname}/dao/fileManagers/files/products.json`;
  }
  getProducts = async () => {
    if (fs.existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      return products;
    } else {
      return [];
    }
  };
  addProduct = async (product) => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(data);
    const newProductId = uuidv4();
    product._id = newProductId;
    products.push(product);
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, 2),
      "utf-8"
    );
    return product;
  };
  getProductsById = async (id) => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(data);
    const product = products.filter((p) => p._id === id)[0];
    return product || null;
  };
  deleteProduct = async (id) => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(data);
    const indexToDelete = products.findIndex((p) => p._id === id);
    const deletedProduct = products.splice(indexToDelete, 1)[0];
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(products, null, 2),
      "utf-8"
    );
    return deletedProduct;
  };

  updateProduct = async (productToUpdate, id) => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(data);
    const index = products.findIndex((p) => p._id === id);

    if (index !== -1) {
      Object.assign(products[index], productToUpdate, { _id: id });

      const result = await fs.promises.writeFile(
        this.path,
        JSON.stringify(products, null, "\t")
      );
      return result;
    } else {
      console.error("Product not found");
      return null;
    }
  };

  productPaginate2 = async (filter, options) => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(data);

    const filteredProducts = products.filter((product) => {
      const categoryMatch =
        filter.$or[0].category.$regex &&
        product.category.includes(filter.$or[0].category.$regex);

      const stockMatch =
        filter.$or[1].stock.$gte &&
        product.stock >= Number(filter.$or[1].stock.$gte);

      return categoryMatch || stockMatch;
    });

    const startIndex = (options.page - 1) * options.limit;
    const endIndex = startIndex + options.limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      docs: paginatedProducts,
      totalDocs: filteredProducts.length,
      limit: options.limit,
      page: options.page,
      totalPages: Math.ceil(filteredProducts.length / options.limit),
    };
  };

  productPaginate = async (page) => {
    const data = await fs.promises.readFile(this.path, "utf-8");
    const products = JSON.parse(data);
    const limit = 4;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);
    return {
      docs: paginatedProducts,
      totalDocs: products.length,
      limit,
      page,
      totalPages: Math.ceil(products.length / limit),
    };
  };
}
