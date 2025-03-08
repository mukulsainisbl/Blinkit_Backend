import {Router} from 'express'
import { AddSubCategoryContoller, deleteSubCategoryController, editSubCategoryController, getSubCategoryController } from '../controllers/subCategory.Controller.js'
import auth from '../middleware/authMiddleware.js'

const subCategoryRouter = Router()

subCategoryRouter.post('/create' ,auth, AddSubCategoryContoller)

subCategoryRouter.post('/get' , getSubCategoryController)

subCategoryRouter.put('/update' , auth , editSubCategoryController)

subCategoryRouter.delete('/delete' , auth, deleteSubCategoryController)

export default subCategoryRouter