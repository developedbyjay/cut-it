import mongoose, { Schema, model, Types } from "mongoose";

export interface ILink {
  title: string;
  destination: string;
  backHalf: string;
  shortLink: string;
  creator: Types.ObjectId;
  totalVisitCount: number;
}

const linkSchema = new Schema<ILink>(
  {
    title: { type: String, required: true },
    destination: { type: String, required: true },
    backHalf: { type: String, required: true, unique: true },
    shortLink: { type: String, unique: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalVisitCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

linkSchema.pre("save", async function (next) {
  if (this.isModified("backHalf") || this.isNew) {
    this.shortLink = `${process.env.FRONTEND_URL}/${this.backHalf}`;
  }
  next();
});

const Link = model<ILink>("Link", linkSchema);
export { Link };
