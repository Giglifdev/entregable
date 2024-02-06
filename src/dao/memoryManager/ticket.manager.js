import { __dirname } from "../../utils.js";
import { TicketsModel } from "../dbManagers/models/ticket.model.js";

export default class TicketManager {
  constructor(path) {
    this.path = path;
  }
  create = async (newTiket) => {
    const ticket = await TicketsModel.create(newTiket);
    return ticket;
  };
  findById = async (id) => {
    const ticket = await TicketsModel.findOne({ _id: id });
    return ticket;
  };
}
