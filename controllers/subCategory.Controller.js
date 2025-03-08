import SubCategoryModel from "../models/subCategory.model.js";

export const AddSubCategoryContoller = async (req, res) => {
  try {
    const { name, image, category } = req.body;
    if (!name && !image && !category[0]) {
      return res.status(400).json({
        message: "All fields are required",
        error: false,
        success: true,
      });
    }
    const payload = {
      image,
      name,
      category,
    };
    const createSubCategory = new SubCategoryModel(payload);
    const save = await createSubCategory.save();

    return res.json({
      message: "Sub Category Created",
      data: save,
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

export const getSubCategoryController = async (req, res) => {
  try {

    let subCategoryData = await SubCategoryModel.find().sort({createdAt: -1}).populate('category')
    return res.status(200).json({
      message: "All subcategory Data",
      data : subCategoryData,
      error: false,
      success: true,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const editSubCategoryController = async(req,res)=>{
  try {
    let {_id , name , image,category} = req.body

    const checkSubCategory = await SubCategoryModel.findById(_id)

    if(!checkSubCategory){
      return res.status(400).json({
        message : "Check you _id",
        error : true,
        success : false
      })
    }

    const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id ,{
      name, 
      image,
      category
    })

    return res.json({
      message : "Update SubCategory Successfully",
      data : updateSubCategory,
      error: false,
      success  :true
    })

    
  } catch (error) {
    return res.status(500).json({
      message : error.message  || error ,
      error : true,
      success :false

    })
  }
}
export const deleteSubCategoryController = async(req,res) => {

  try {
      
    const {_id} = req.body
    const deleteSub = await SubCategoryModel.findByIdAndDelete(_id)
    return res.status(200).json({
      message: "Delete Successfully",
      data: deleteSub,
      error : false,
      success :true
    })

    
  } catch (error) {
    return res.status(500).json({
      message : error.message  || error ,
      error : true,
      success :false

    })
  }
}
