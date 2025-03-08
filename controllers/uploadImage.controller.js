import uploadImageCloudonary from "../utils/uploadImageCloudinary.js"

const uploadImageController = async(req,res)=>{

    try {

        const file = req.file
        const uploadImage = await uploadImageCloudonary(file)
        
         
        return res.json({
            message : "Upload Success",
            data:uploadImage,
            success : true,
            error : false
                })
        
    } catch (error) {
        return res.status(500).json({
            message : error.message || error ,
            error : true,
            success : false
        })
    }
}
export default uploadImageController