import {type Request, type Response, type NextFunction} from 'express'
import {z} from 'zod';


export const validateRequest  = (schema: z.ZodType) =>{
    return (req: Request, res: Response, next: NextFunction)=>{
        const result = schema.safeParse(req.body);

        if(!result.success){
            const errorMessage = result.error.issues.map((err) => err.message);
            const error = errorMessage.join(", ");
            return res.status(400).json({message: error})
        }

        next();
    };
}