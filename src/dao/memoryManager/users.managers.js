import { __dirname } from "../../utils.js";
import { cartsModel } from "../dbManagers/models/carts.model.js";
import usersModel from "../dbManagers/models/users.model.js";

export default class usersManager {
  constructor(path) {
    this.path = path;
  }
  create = async (newuser) => {
    const user = await usersModel.create(newuser);
    return user;
  };

  findByEmail = async (emailSend) => {
    const user = await usersModel
      .findOne({ email: emailSend })
      .populate({
        path: "cart.id",
        model: "carts",
      })
      .lean();
    return user;
  };
  findByID = async (id) => {
    const user = await usersModel.findOne({ _id: id });
    return user;
  };

  updateRol = async (id, rol) => {
    const result = await usersModel.updateOne(
      { _id: id },
      { $set: { role: rol } }
    );
    const updatedUser = await usersModel.findOne({ _id: id });
    return updatedUser;
  };

  updatePass = async (newPass, emailSend) => {
    const result = await usersModel.updateOne(
      { email: emailSend },
      { $set: { password: newPass } }
    );
    const updatedUser = await usersModel.findOne({ email: emailSend });
    return updatedUser;
  };

  setCartToUser = async (cid, uid) => {
    try {
      const user = await usersModel.findOneAndUpdate(
        { _id: uid },
        { $push: { "cart.id": cid } },
        { new: true }
      );
    } catch (error) {
      console.error(error.message);
    }
  };
}
