import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { Prisma } from "../generated/prisma/client.js";
import {type Request, type Response, type NextFunction} from 'express'

//404 -Not Found

type HttpError = Error & { statusCode? : number }

const notFound = (req: Request, res: Response, next: NextFunction) =>{
    const error: HttpError = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404

    next(error);
}
//Global Error Handler
const errorHandler = (err: HttpError & {status?: string}, req: Request, res: Response, next: NextFunction) =>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    //Handle Prisma validation error
    const knownErr = err as Prisma.PrismaClientKnownRequestError & HttpError;
    const prismaErr = err as Prisma.PrismaClientValidationError & HttpError;

if(err instanceof Prisma.PrismaClientValidationError){
    prismaErr.statusCode = prismaErr.statusCode ||400
    err.message = "Invalid data provided";
}

if (err instanceof Prisma.PrismaClientKnownRequestError){
    if (err.code === "P2002"){
        const target = (err.meta as { target?: string[] | string } | undefined)?.target;
        const field = Array.isArray(target) ? target[0] : target ?? "field";
        knownErr.statusCode = 400;
        knownErr.message = `${field} already exist`
    }
}
// Handle record not found
if(knownErr.code === "P2025"){
    err.statusCode = 404;
    err.message = "Record not record"
}

if(err instanceof PrismaClientKnownRequestError){
    if (knownErr.code === "2003"){
        knownErr.statusCode = 400
        knownErr.message = "Invalid reference: related record does not exist"
    }
}

res.status(err.statusCode ?? 500).json({
    status: err.status ?? "error",
    message: err.message,

    ...(process.env.NODE_ENV === "development" && {stack: err.stack})
});
};

export {notFound, errorHandler}







