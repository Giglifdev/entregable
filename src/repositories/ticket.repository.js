export default class TiketRepository {
  constructor(TiketDao) {
    this.TiketDao = TiketDao;
  }

  create = async (newTiket) => {
    const tiket = await this.TiketDao.create(newTiket);
    return tiket;
  };
  findById = async (id) => {
    const tiket = await this.TiketDao.create(id);
    return tiket;
  };
}
