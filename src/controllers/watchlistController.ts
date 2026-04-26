import {type Request,type Response } from 'express' 
import {prisma} from "../lib/prisma.js";
import type { WatchlistStatus } from '../generated/prisma/enums.js';
import type { Prisma } from "../generated/prisma/client.js";





export const addToWatchlist = async (req: Request, res: Response) =>{
 
    const {movieId, status, rating, notes, userId} =req.body as {
        movieId:string, status: WatchlistStatus, rating:number, notes: string, userId: string
    }

    const movie = await prisma.movie.findUnique({
        where: {id: movieId}
    })

    if(!movie){
        return res.status(404).json({error: "Movie not found"})
    }

    const exitstingInWatchlist = await prisma.watchListItem.findUnique({
        where: {userId_movieId:{
            userId: userId,
            movieId: movieId
        }
        }
    })
    if(exitstingInWatchlist){
        return res.status(400).json({error: "Movie already in the watchlist"})
    }

    const watchListItem = await prisma.watchListItem.create({
        data:{
            userId,
            movieId,
            status : status || "PLANNED",
            rating,
            notes  
        }
    })

    res.status(201).json({
        status: "Success",
        data: {
            watchListItem,
        }
    })

   }

export const removeFromWatchlist = async (req: Request, res: Response) =>{

    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if(!id){
        return res.status(400).json({error: "Missing watchlist item id"});
    }
    const watchListItem = await prisma.watchListItem.findUnique({
        where: { id }, 
    });

    if (!watchListItem) {
        return res.status(404).json({error: "Movie is not on the watchlist"})
    }

    if (!req.user || typeof req.user === "string" || !("id" in req.user)) {
        return res.status(403).json({ error: "Forbidden Request" });
      }

    if (watchListItem.userId !== req.user.id){
        res.status(403).json({error: "Not allow to update the watchlist"})
    }

    await prisma.watchListItem.delete({
        where: {id}
    });

    res.status(200).json({
        status: "Success",
        message: "Movie removed successfully"
    })
}

export const updateWatchlistItem = async (req: Request, res: Response) =>{
    const {status, rating, notes} = req.body as {
        status: string, rating: number, notes: string}

    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if(!id){
        return res.status(400).json({error: "Missing watchlist item id"});
    }
    const watchListItem = await prisma.watchListItem.findUnique({
        where: {id}
    })

    if(!watchListItem){
        return res.status(404).json({error: "Movie not found!"})
    }

    if (!req.user || typeof req.user === "string" || !("id" in req.user)) {
        return res.status(403).json({ error: "Forbidden Request" });
      }
    if(watchListItem.userId !== req.user.id){
        return res.status(403).json({
            error: "You are not allow to update this movie"
        })}

    const updateData : Prisma.WatchListItemUpdateInput = {};

    if(status !== undefined) updateData.status = status.toUpperCase() as WatchlistStatus
    if(rating !== undefined) updateData.rating = rating
    if(notes !== undefined) updateData.notes = notes

    await prisma.watchListItem.update({
        where: {id},
        data:updateData,
    })

    res.status(200).json({
        status: "Success",
        message: "Watchlist Item updated successfully"
    })


    
}