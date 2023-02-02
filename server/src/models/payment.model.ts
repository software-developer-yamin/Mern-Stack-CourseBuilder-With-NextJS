import { InferSchemaType, model, Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    razorpay_signature: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    razorpay_subscription_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

type IPayment = InferSchemaType<typeof paymentSchema>;

export default model<IPayment>("Payment", paymentSchema);
