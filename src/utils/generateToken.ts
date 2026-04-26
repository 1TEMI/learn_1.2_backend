import jwt from "jsonwebtoken";
import { type Response } from "express";
import "dotenv/config";


const JWT_SECRET_KEY  = process.env.JWT_SECRET!;



  const generateToken = (userId: string, email: string, res: Response): string => {
    const payload = {id: userId, email: email};
    const token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn:"1d"});
    
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: (1000 * 60 * 24)
    })

    return token
  };

 
  
  export default generateToken

