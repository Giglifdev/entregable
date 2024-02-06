import mongoose from "mongoose";

const messageCollection = "messages";

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  text: {
    type: String,
  },
});
export const messageModel = mongoose.model(messageCollection, messageSchema);
