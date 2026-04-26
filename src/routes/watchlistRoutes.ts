import {Router} from 'express'
import { addToWatchlist, removeFromWatchlist, updateWatchlistItem} from '../controllers/watchlistController.js';
import { AuthServices } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { addToWatchlistSchema } from "../validators/watchListValidators.js";



const watchlistRoute: Router = Router();

watchlistRoute.post('/', AuthServices, validateRequest(addToWatchlistSchema),addToWatchlist)
watchlistRoute.delete('/:id', AuthServices,removeFromWatchlist)
watchlistRoute.put('/:id', AuthServices,updateWatchlistItem)


export default watchlistRoute