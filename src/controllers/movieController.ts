import {type Request, type Response} from 'express'
import {prisma} from '../lib/prisma.js'

export const getAllMovie = async (req: Request, res: Response) =>{

    // const availableMovie = await prisma.movie.findUnique({
    //     where:{ id_createdBy:{
    //         id:id,
    //         createdBy: userId
    //     }}
    // })

    if (!req.user || typeof req.user === "string" || !("id" in req.user)) {
        return res.status(403).json({ error: "Forbidden Request" });
      }
     
    const movies = await prisma.movie.findMany({
        
        where: {createdBy:req.user.id }
    });

    res.status(200).json({
        success: true,
        count: movies.length,
        data: movies
    })
}