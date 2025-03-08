import CartProductModel from "../models/cartProduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
export const cashOnDeliveryController = async (req, res) => {
  try {
    const userId = req.userId;

    const { list_item, totalAmt, addressId, subTotalAmt } = req.body;

    const payload = list_item.map((el) => {
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        paymentId: "",
        paymentStatus: "Cash On Delivery",
        delivery_address: addressId,
        subTotalAmt: totalAmt,
        totalAmt: subTotalAmt,
      };
    });

    const generateOrder = await OrderModel.insertMany(payload);

    ///Remove From Cart

    const removeCartItems = await CartProductModel.deleteMany({
      userId: userId,
    });
    
    const updateInUser = await UserModel.updateOne(
      { _id: userId },
      { shopping_cart: [] }
    );

    return res.json({
      message: "Order Successfully",
      error: false,
      success: true,
      data: generateOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const priceWithDiscount = (price, dis = 1) => {
  const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmount);

  return actualPrice;
};

export async function paymentController(req, res) {
  try {
    const userId = req.userId;

    const { list_item, totalAmt, addressId, subTotalAmt } = req.body;

    const payload = list_item.map((el) => {
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        paymentId: "",
        paymentStatus: "Online",
        delivery_address: addressId,
        subTotalAmt: totalAmt,
        totalAmt: subTotalAmt,
      };
    });

    const generateOrder = await OrderModel.insertMany(payload);

    ///Remove From Cart

    const removeCartItems = await CartProductModel.deleteMany({
      userId: userId,
    });
    const updateInUser = await UserModel.updateOne(
      { _id: userId },
      { shopping_cart: [] }
    );

    return res.json({
      message: "Order Successfully",
      error: false,
      success: true,
      data: generateOrder,
    });


  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const showOrderController = async (req, res) => {
  try {

    let userId = req.userId;
    const order = await OrderModel.find({userId});


    if (!order) {
      return res.json({
        message: "Order not Found",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "All Order",
      error: false,
      success: true,
      data : order

    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};



export const deleteOrderController = async (req, res) => {
  try {
    let userId = req.userId; // Extract userId from request

    if (!userId) {
      return res.status(400).json({
        message: "Please Login",
        error: true,
        success: false,
      });
    }

    // Delete all orders associated with the user
    let deletedOrders = await OrderModel.deleteMany({ userId });

    if (deletedOrders.deletedCount === 0) {
      return res.status(404).json({
        message: "No orders found for this user",
        error: true,
        success: false,
        data : deletedOrders
      });
    }

    return res.status(200).json({
      message: "All orders deleted successfully",
      success: true,
      error: false,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};



