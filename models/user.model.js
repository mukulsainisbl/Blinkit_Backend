import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: { type: String, required: [true, "Password is required"] },
    avatar: { type: String, default: "" },
    mobile: { type: String, default: null },
    refresh_token: { type: String, default: null },
    verify_email: { type: String, default: false },
    last_login_date: { type: Date, default: "" },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },

    address_details: [{ type: mongoose.Schema.ObjectId, ref: "address" }],
    shopping_cart: [{ type: mongoose.Schema.ObjectId, ref: "cartProduct" }],
    order_history: [{ type: mongoose.Schema.ObjectId, ref: "order" }],
    forgot_passsword_otp: { type: String, default: null },
    forgot_passsword_expiry: { type: Date, default: "" },
    role: { type: String, enum: ["ADMIN", "USER"] ,default: "USER" },
    
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("Users", userSchema);

export default UserModel;
