import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefeshToken.js";
import uploadImageCloudonary from "../utils/uploadImageCloudinary.js";
import generateOtp from "../utils/generateOtp.js";
import forgotPasswordTemplate from "../utils/forgetPasswordTemplate.js";
import jwt from 'jsonwebtoken'
//User Register Controller
export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Provide Name , Email , Password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (user) {
      return res.json({
        message: "Already Registered Email",
        error: true,
        success: false,
      });
    }

    let salt = await bcryptjs.genSalt(10);
    let hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new UserModel(payload);
    await newUser.save();

    let verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${newUser._id}`;

    const verficationEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from Mukul Website",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return res.json({
      message: "User register successfully",
      error: false,
      success: true,
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
//Verify Email controller

export async function verifyEmailController(req, res) {
  try {
    const { code } = req.body;
    const user = await UserModel.findOne({ _id: code });
    if (!user) {
      return res.status(400).json({
        message: error.message || error,
        error: success,
        success: false,
      });
    }

    const updatedUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );

    return res.json({
      message: "Verify Email complete",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: true,
    });
  }
}

//Login Controller

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Provide Both email and Password",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Contact to admin",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Check Your Password",
        error: true,
        success: false,
      });
    }

    
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    
    const updateUser = await UserModel.findByIdAndUpdate(user._id, {
      last_login_date : new Date()


    })

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    return res.json({
      message: "Login Succcessfully",
      error: false,
      success: true,

      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Logout Controller

export async function logoutController(req, res) {
  try {
    const userid = req.userId; // Middleware

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });

    return res.json({
      message: "Logut Successfully",
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
}

//Upload User Avatar

export async function uploadAvtar(req, res) {
  try {
    const userId = req.userId; // AuthMiddleware

    const image = req.file; // Multer
    const upload = await uploadImageCloudonary(image);

    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });

    return res.json({
      message: "Upload Profile",
      success : true,
      error : false,
      data: {
        _id : userId,
        avatar: upload.url,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//Update user Details

export async function updateUserDetails(req, res) {
  try {
    const userId = req.userId; //Auth Middleware
    const { name, email, mobile, password } = req.body;
   
    let hashPassword = ""

    if(password){
      const salt = await bcryptjs.genSalt(10)
      hashPassword = await bcryptjs.hash(password , salt)
    }

    const updateUser = await UserModel.updateOne({_id: userId}, {
      ...(name && { name: name }),
      ...(email && { email: email }),
      ...(mobile && { mobile: mobile }),
      ...(password &&{password : hashPassword})
    });

    return res.json({
      message: "Updated Successfully",
      error : false,
      success :true,
      data : updateUser

    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}


//Forgot Password

export async function forgotPasswordController(req,res) {
  
  try {

    const {email} = req.body
    const user = await UserModel.findOne({email})

    if(!user){
      return res.status(400).json({
        message :"Email not Register for Forgot password",
        error : true,
        success : false
      })
    }

    const otp = generateOtp()
    
    const expireTime=  new Date() + 60 * 60 * 1000 // 1Hour

    const update = await UserModel.findByIdAndUpdate(user._id , {
      forgot_passsword_otp : otp,
      forgot_passsword_expiry : new Date(expireTime).toISOString()
    })

    await sendEmail({
      sendTo : email,
      subject : "forgot Password from Mukul Website",
      html : forgotPasswordTemplate({
        name : user.name,
        otp : otp
      })
    })

    return res.json({
      message : "Otp send in your emial",
      error :false,
      success :true,
      

    })
    
  } catch (error) {
    return res.status(500).json({
      message : error.message || error ,
      error : true,
      success : false
    })
  }
}


export async function verifyForgotPassword(req,res){
  try {
    
    const {email , otp} = req.body

    
    if(!email  || !otp){
      return res.status(400).json({
        message :  "Provide required fields email , otp ",
        error : true,
        success :false
      })
    }

    let user = await UserModel.findOne({email})

    if(!user){
      return res.status(400).json({
        message :"Email not Register for Forgot password",
        error : true,
        success : false
      })
    }


    const currentTime = new Date().toISOString()

    if(user.forgot_passsword_expiry < currentTime){
      return res.status(400).json({
        message : "otp is expire",
        error : true,
        success : false
      })
    }

    if(otp !== user.forgot_passsword_otp){
      return res.status(400).json({
        message : "Invalid Otp",
        error : true,
        success : false

      })
    }

    //if otp is not expire
    //otp is equal to forgot password

    const updateUser =  await UserModel.findByIdAndUpdate(user?._id , {
        forgot_passsword_otp:"",
        forgot_passsword_expiry : ""
    })

        return res.json({
          message : "Verify OTP successfully",
          error :false,
          success :true
        })

  } catch (error) {
    return res.status(500).json({
      message : error.message  || error ,
      error : true ,
      success : false
    })
  }
}


export async function resetPassword(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    // Check for missing fields
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Provide required fields: email, newPassword, confirmPassword",
        error: true,
        success: false,
      });
    }


    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Email not registered for resetting the password",
        error: true,
        success: false,
      });
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Both passwords do not match",
        error: true,
        success: false,
      });
    }

    // Hash the new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    // Update the user's password
    await UserModel.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      message: "Password updated successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    // Catch and return any errors
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}


///Refresh token controller
export async function refreshToken(req,res) {
  try {
    
    let refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1]

   if(!refreshToken){
    return res.status(401).json({
      message : "Unauthorised Access or Invalid token",
      error : true,
      success : false
    })
   }


   const verifyToken = await jwt.verify(refreshToken , process.env.SECRET_KEY_REFRESH_TOKEN)

   if(!verifyToken){
    return res.status(401).json({
      message : "Token is Expired",
      error : true,
      success : false
    })
   }

   const userId = verifyToken?._id


   const newAccessToken = await generateAccessToken(userId)
   const cookiesOption = {
    httpOnly :true,
    secure : true,
    sameSite : "None"
   }

   res.cookie("accessToken" ,  newAccessToken , cookiesOption)

   return res.json({
    message : "New Access Generated",
    error : "false",
    success : true,
    data :{
      accessToken : newAccessToken
    }
   })



  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error : true,
      success : false

    })
  }
}

//Get login user Details

export async function userDetails(req,res) {
  try {
    const userid = req.userId

    const user = await UserModel.findById(userid).select('-password -refreshToken ')
    return res.json({
      message : "userDetails",
      data : user,
      error: false,
      success : true
    })
  } catch (error) {
    return res.status(500).json({
      message : "Something is wrong",
      error: true,
      success :false
    })
  }
  
}