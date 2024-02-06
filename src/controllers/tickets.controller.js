import { processPurchase as processPurchaseService } from "../services/tickets.services.js";

const processPurchase = async (req, res) => {
  try {
    const user = req.user;
    const cartId = req.params.cid;
    const ticket = await processPurchaseService(cartId, user);
    res.send({ payload: ticket });
  } catch (error) {
    res.status(500).send({ error: error.message });
    req.logger.error(error.message);
  }
};

export { processPurchase };
