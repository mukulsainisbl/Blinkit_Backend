import {Router} from "express"
import auth from "../middleware/authMiddleware.js"
import { cashOnDeliveryController, deleteOrderController, paymentController, showOrderController } from "../controllers/order.controller.js"


const orderRouter = Router()

orderRouter.post('/cash-on-delivery' ,auth,   cashOnDeliveryController)
orderRouter.post('/checkout'  , auth,paymentController)
orderRouter.get('/get-order' , auth , showOrderController)
orderRouter.delete('/delete-order' , auth , deleteOrderController)
export default orderRouter