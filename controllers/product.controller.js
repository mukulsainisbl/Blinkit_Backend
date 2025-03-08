import ProductModel from "../models/product.model.js";

export const createProductConroller = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
      publish,
    } = req.body;

    if (
      !name ||
      !image ||
      !category ||
      !subCategory ||
      !unit ||
      !price ||
      !description ||
      !publish
    ) {
      return res.status(400).json({
        message: "Enter All required fields",
        error: true,
        success: false,
      });
    }

    const product = new ProductModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
      publish,
    });
    await product.save();

    return res.json({
      message: "Product Created Successfully",
      data: product,
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

export const getProductController = async (req, res) => {
  try {
    let { page, limit, search } = req.body;
    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }
    // const query = search ? {
    //      $text :{
    //       $search : search
    //      }
    // } : {}

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } }, // Case-insensitive search
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const skip = (page - 1) * limit;
    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      ProductModel.countDocuments(query),
    ]);

    return res.json({
      message: "Product Data",
      error: false,
      success: true,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        message: "Provide category Id ",
        error: true,
        success: false,
      });
    }
    const product = await ProductModel.find({
      category: { $in: id },
    });
    return res.json({
      message: "Category Product List",
      data: product,
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

export const getProductByCategoryAndSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryId, page, limit } = req.body;

    if (!categoryId || !subCategoryId) {
      return res.status(400).json({
        message: "Provide Both Category And subcategory Id",
        error: true,
        success: false,
      });
    }

    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }

    const query = {
      category: { $in: categoryId },
      subCategory: { $in: subCategoryId },
    };

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProductModel.countDocuments(query),
    ]);

    return res.json({
      message: "Product List",
      data: data,
      totalCount: dataCount,
      page: page,
      limit: limit,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await ProductModel.findOne({ _id: productId });
    return res.json({
      message: "Product Details",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message || error,
      error: true,
      success: false,
    });
  }
};

//Update product

export const updateProductDetails = async (req, res) => {
  try {
    let { _id } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "Provide Product Id",
        error: true,
        success: false,
      });
    }

    const updateProduct = await ProductModel.updateOne(
      { _id: _id },
      {
        ...req.body,
      }
    );

    return res.json({
      message: "Update Data Succesfully",
      data: updateProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    return req.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

// Delete Product
export const deleteProductDetails = async (req, res) => {
  try {
    let { _id } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "Provide Product _id",
        error: true,
        success: false,
      });
    }

    const deleteProduct = await ProductModel.deleteOne({ _id: _id });

    return res.json({
      message: "Delete Succesfully",
      data: deleteProduct,
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

// Search Product

export const searchProduct = async (req, res) => {
  try {
    let { search, page, limit } = req.body;

    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }

    const query = search
      ? {
          $text: {
            $search : search
          }
        }
      : {};


      const skip = (page - 1) * limit
 

      const [data , dataCount ] = await Promise.all([
        ProductModel.find(query).sort({createdAt : -1}).skip(skip).limit(limit).populate("category subCategory"),
        ProductModel.countDocuments(query)
      ])

      return res.json({
        message : "Product Data",
        error : false,
        success : true,
        data : data,
        totalCount : dataCount,
        totalPage : Math.ceil(dataCount/limit),
        page : page ,
        limit : limit
      })
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
