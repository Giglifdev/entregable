import mongoose from "mongoose";

const ticketsCollection = "tikets";

const ticketsSchema = new mongoose.Schema({
  code: String,
  purchase_datatime: Date,
  amount: Number,
  purchaser: String,
});
export const TicketsModel = mongoose.model(ticketsCollection, ticketsSchema);
