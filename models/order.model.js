import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "User" },
  orderId: { type: String, required: [true, "Provide orderId"], unique: true },
  product_details: { name: String, image: Array },
  productId: { type: mongoose.Schema.ObjectId, ref: "product" },
  paymentId: { type: String, default: "" },
  paymentStatus: { type: String, default: "" },
  delivery_address :{type:mongoose.Schema.ObjectId ,ref:"address"},

  subTotalAmt:{type:Number, default:0},
  totalAmt:{type:Number, default:0},
  invoice_reciept:{type:String, default:""}
  


},{timestamps:true});

const OrderModel = mongoose.model("order" , orderSchema)
export default OrderModel