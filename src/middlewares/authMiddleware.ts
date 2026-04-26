import {type NextFunction, type Request, type Response } from 'express'
import Jwt  from 'jsonwebtoken'
import 'dotenv/config'
const JWT_SECRET = process.env.JWT_SECRET!;

export const AuthServices = (request: Request, response: Response, next: NextFunction) =>{

    //Call the token authorizer
    const authJwtToken = request.headers.authorization

    //Check if the token is empty
    if(!authJwtToken){
        response.status(403).json({ message: 'Forbidden Request' });
        return
    }
    checkJwtValidity(authJwtToken)
    .then(user =>{
        request["user"]= user;

        next();
    })
    .catch(err =>{
        response.status(403).json(`Token not validated, ${err}`)
    })

}

const checkJwtValidity = async(authJwtToken: string) =>{
    const user = await Jwt.verify(authJwtToken, JWT_SECRET )

    return user;
}