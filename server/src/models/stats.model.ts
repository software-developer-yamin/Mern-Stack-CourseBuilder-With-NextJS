import { InferSchemaType, model, Schema } from "mongoose";

const statsSchema = new Schema(
  {
    users: {
      type: Number,
      default: 0,
    },

    subscription: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

type IStats = InferSchemaType<typeof statsSchema>;

export default model<IStats>("Stats", statsSchema);
