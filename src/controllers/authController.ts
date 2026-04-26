import {prisma} from "../lib/prisma.js";
import { type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import  generateToken  from "../utils/generateToken.js";



const register = async (req: Request, res: Response) => {

    // res.json({message: 'it is working for sure'})
  const {name, email, password} = req.body as {name: string, email: string, password: string};
//Confirm all data is provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }
//Check if user already exist
  const userExists = await prisma.user.findUnique({
    where: { email }
  });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  //Hash the password
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password, salt)

//Create User
const user = await prisma.user.create({
    data:{
        name,
        email,
        password: hashedPassword
    }
})
    res.status(201).json({
        status: "Success",
        data: {
            user:{
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    })

}


const login = async (req:Request, res: Response) =>{

    const {email, password} =req.body;

    //Confirm all data is provided
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }
    //Check if user exist in the database
    const user = await prisma.user.findUnique({
    where: { email }
    });

    if (!user){
        return res.status(401).json({error: "Incorrect Email or Password"})
    }

    //Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid){
        return res.status(401).json({error: "Incorrect Email or Password"})
    }
//Generate web token
const token = generateToken(user.id, user.email, res)
// const token = generateToken(user.id, res);
// console.log(token)
//if credential is correct loggin
    res.status(201).json({
        status: "Success",
        data: {
            user:{
                id: user.id,
                email: user.email
            },
            token,
        }
    });

     
};

export { register, login }; 