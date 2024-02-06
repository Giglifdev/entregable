import { messageModel } from "../dbManagers/models/message.model.js";
import { __dirname } from "../../utils.js";

export default class MessageManager {
  constructor(path) {
    this.path = path;
  }
  getAll = async () => {
    const messages = await messageModel.find().lean();
    return messages;
  };
  saveMesssage = async (data) => {
    const save = await messageModel.create(data);
    return save;
  };
}
