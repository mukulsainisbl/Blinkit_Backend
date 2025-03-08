import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const addAddressController = async(req,res)=>{
    try {

        let userId  = req.userId

        const { address_line,city,state,pincode,country,mobile} = req.body
        const createAddress =  new AddressModel({
            address_line,
            city,
            country,
            state,
            pincode,
            mobile,
            userId : userId
        })

        const saveAddress = await createAddress.save()
        const addUserAddressId = await UserModel.findByIdAndUpdate(userId,{
            $push:{
                address_details : saveAddress._id
            }
        })


        return res.json({
            message : "Address Created Successfully",
            data : saveAddress,
            error : false,
            success : true
        })
        
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const getAddressController = async (req,res)=>{
    try {
        
        const userId = req.userId
        const data = await AddressModel.find({
            userId : userId
        })
          
        return res.json({
            message : "List of Address",
            error : false,
            success : true,
            data : data
        })

    } catch (error) {
           return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export const updateAddressController = async (req, res) => {
    try {
        const userId = req.userId; // Middleware sets this
        const { _id, address_line, city, state, country, pincode, mobile } = req.body;

        const updateAddress = await AddressModel.updateOne(
            { _id, userId }, // Ensure the address belongs to the user
            { address_line, city, state, country, mobile, pincode }
        );

        if (updateAddress.matchedCount === 0) {
            return res.status(404).json({
                message: "Address not found or you are not authorized to update it",
                success: false,
                error: true,
            });
        }

        return res.status(200).json({
            message: "Address updated successfully",
            success: true,
            error: false,
            data: updateAddress,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
            error: true,
        });
    }
};

export const deleteAddressController = async (req, res) => {
    try {
        const userId = req.userId;
        const { _id } = req.body;

        const disableAddress = await AddressModel.updateOne(
            { _id, userId }, // Ensure the address belongs to the user
            { status: false }
        );

        if (disableAddress.matchedCount === 0) {
            return res.status(404).json({
                message: "Address not found or you are not authorized to delete it",
                success: false,
                error: true,
            });
        }

        return res.status(200).json({
            message: "Address removed successfully",
            success: true,
            error: false,
            data: disableAddress,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
            error: true,
        });
    }
};
