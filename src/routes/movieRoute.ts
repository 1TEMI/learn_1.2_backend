import { Router } from "express";
import { getAllMovie } from "../controllers/movieController.js";
import { AuthServices } from "../middlewares/authMiddleware.js";



const movieRouter: Router = Router()

movieRouter.get("/all-movies",AuthServices ,getAllMovie)


export default movieRouter

