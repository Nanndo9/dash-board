import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const routes = Router();

routes.get('/users', UserController.getAllUsers);
routes.post('/registration',UserController.createUser)
export default routes;
