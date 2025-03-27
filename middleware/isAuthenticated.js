import jwt from "jsonwebtoken";

// Define a middleware function to verify JWT tokens
const authenticateToken = async(req, res, next) => {
  try {
    const token = req.cookies.token;
    if(!token) {
      return res
      .status(401)
      .json({
         message: "Token is not provided",
         sucess: false,
       });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
      return (
        res.status(401).json({message: "Invalid token decoded"}),
          success = false
      );
    }
    req.id = decoded.userId;
    next();

  }
  catch (error){
    res.status(401).json({
      message: "Invalid token" + error.message
    });
  }
}

export default authenticateToken;