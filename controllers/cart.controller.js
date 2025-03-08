import CartProductModel from "../models/cartProduct.model.js";
import UserModel from "../models/user.model.js";

export const addToCartItemController = async (req, res) => {
  try {
    const userId = req.userId; // Fix userId extraction
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Provide Product Id" });
    }

    const checkItemCart = await CartProductModel.findOne({
      userId: userId,
      productId: productId,
    }).populate("productId");

    //Check Item
    if (checkItemCart) {
      return res.status(400).json({
        message: "Item Already In Cart",
      });
    }

    // Add item to cart
    const cartItem = new CartProductModel({
      quantity: 1,
      userId: userId,
      productId: productId,
    });

    const savedCartItem = await cartItem.save();

    // Update user shopping cart
    const updateCart = await UserModel.updateOne(
      { _id: userId },
      { $push: { shopping_cart: productId } }
    );

    return res.json({
      message: "Item Added Successfully",
      data: savedCartItem,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getCartItemController = async (req, res) => {
  try {
    const userId = req.userId;
    const cartItem = await CartProductModel.find({
      userId: userId,
    }).populate("productId");

    return res.json({
      data: cartItem,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};

export const updateCartItemQtyController = async (req, res) => {
  try {
    let userId = req.userId;
    const { _id, qty } = req.body;

    if (!_id || !qty) {
      return res.status(400).json({
        message: "Provide _Id , Qty",
      });
    }

    const updateCartModel = await CartProductModel.updateOne(
      {
        _id: _id,
        userId : userId
      },
      {
        quantity: qty,
      }
    );


    return res.json({
      message : "Updated Cart",
      success : true,
      error : false,
      data :updateCartModel
    })
    
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};


//Delete Product In Cart
export const deleteCartItemQtyController = async(req,res)=>{
  try {

    const userId = req.userId //Middleware

    const {_id} = req.body

    if(!_id){
      return res.status(400).json({
        message : "Provide _id",
        error : true,
        success : false,
        
      })
    }


const deleteCartItem = await CartProductModel.deleteOne({_id: _id , userId : userId})

return res.json({
  message : "Item Removed Successfully ",
  error : false,
  success : true,
  data :deleteCartItem

})


    
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};