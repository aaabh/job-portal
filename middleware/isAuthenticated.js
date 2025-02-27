import jwt from "jsonwebtoken";

// Define a middleware function to verify JWT tokens
const authenticateToken =async (req, res, next) => {
  try {
    const token = req.cookie.token;
    if(!token) {
      return res
      .status(401)
      .json({
         message: "Token is not provided",
         sucess: true,
       });
       
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
      return (
        res.status(401).json({message: "Invalid token"}),(success = false)
      );
    }
    req.id = decoded.userId;
    next();

  }
  catch (error){
    res.status(401).json({
      message: "Invalid token"
    });
  }
}

export default authenticateToken;