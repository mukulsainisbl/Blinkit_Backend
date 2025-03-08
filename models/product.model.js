import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String },
  image: { type: Array, default: [] },
  category: [{ type: mongoose.Schema.ObjectId, ref: "category" }],
  subCategory: [{ type: mongoose.Schema.ObjectId, ref: "subCategory" }],
  unit: { type: String, default: "" },
  
  Description : {type:String, default :"Every effort is made to maintain accuracy of all information. However, actual product packaging and materials may contain more and/or different information. It is recommended not to solely rely on the information presented."},
  stock: { type: Number, default: 0 },
  price: { type: Number, default: null },
  discount: {
    type: Number,
    default: null,
  },
  description: { type: String, default: "" },
  more_details: {
    type: Object,
    default: {},
  },
  publish:{type:Boolean, default: true}
},
{
    timestamps:true
});


// Create a text Index
productSchema.index({
  name: "text",
  description : "text"
},{
  name: 10,
  description :5
})

const ProductModel = mongoose.model("product" , productSchema)

export default ProductModel