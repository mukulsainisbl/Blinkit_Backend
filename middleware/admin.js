import UserModel from "../models/user.model.js";

export const admin = async (req, res, next) => {
  try {
    
    const userId = req.userId;
    
    // Check if userId is provided
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: User ID not found",
        error: true,
        success: false,
      });
    }
    
    const user = await UserModel.findById(userId);
    
    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Permission Denied",
        error: true,
        success: false,
      });
    }
    
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: true,
      success: false,
    });
  }
};
