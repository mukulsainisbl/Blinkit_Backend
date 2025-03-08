import { Router } from "express";
import auth from "../middleware/authMiddleware.js";
import { addToCartItemController, deleteCartItemQtyController, getCartItemController, updateCartItemQtyController } from "../controllers/cart.controller.js";
const cartRouter = Router()

cartRouter.post('/create' ,auth,  addToCartItemController)
cartRouter.get('/get' , auth,  getCartItemController)
cartRouter.put('/update-quantity' ,auth, updateCartItemQtyController)
cartRouter.delete('/delete-cart-item' ,auth,  deleteCartItemQtyController)

export default cartRouter