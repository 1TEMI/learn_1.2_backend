import express from 'express'
import 'dotenv/config';
import authRoutes from './routes/authRoute.js';
import watchlistRoute from './routes/watchlistRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'; 





const app = express();
//Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//Authentication
app.use('/api/auth', authRoutes)
app.use('/api/watchlist', watchlistRoute )


app.use(notFound);
app.use(errorHandler)

const PORT = process.env.PORT!;

app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}...`);
});