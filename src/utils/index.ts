import mongoose from "mongoose";

export const generateMongoId = (): string =>
  new mongoose.Types.ObjectId().toHexString();
