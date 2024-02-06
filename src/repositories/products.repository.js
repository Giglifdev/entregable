export default class ProductRepository {
  constructor(ProdDao) {
    this.ProdDao = ProdDao;
  }

  deleteProduct = async (id) => {
    const result = await this.ProdDao.deleteProduct(id);
    return result;
  };
  getProducts = async (id) => {
    const result = await this.ProdDao.getProducts(id);
    return result;
  };
  getProductsById = async (id) => {
    const result = await this.ProdDao.getProductsById(id);
    return result;
  };
  updateProduct = async (productToUpdate, id) => {
    const result = await this.ProdDao.updateProduct(productToUpdate, id);
    return result;
  };
  addProduct = async (product) => {
    const result = await this.ProdDao.addProduct(product);
    return result;
  };
  productPaginate2 = async (filter, options) => {
    const result = await this.ProdDao.productPaginate2(filter, options);
    return result;
  };
  productPaginate = async (page) => {
    const result = await this.ProdDao.productPaginate(page);
    return result;
  };
}
