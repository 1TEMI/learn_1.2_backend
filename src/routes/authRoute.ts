import {Router} from 'express';
import {register, login} from '../controllers/authController.js';



const authRoutes: Router = Router();

authRoutes.post('/register',register)
authRoutes.get('/login', login)

export default authRoutes;

//