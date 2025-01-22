import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const routes = Router();

routes.get('/users', UserController.getAllUsers);
routes.post('/registration',UserController.createUser)
routes.get('/findId/:id',UserController.getUserById)
export default routes;
