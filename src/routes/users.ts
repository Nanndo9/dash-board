import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const routes = Router();

routes.get('/users', UserController.getAllUsers);
routes.post('/registration', UserController.createUser);
routes.get('/findId/:id', UserController.getUserById);
routes.patch('/update/:id', UserController.userUpdate);
routes.delete('/exclude/:id', UserController.deleteUser);
routes.post('/login', UserController.login);
routes.post('/logout', UserController.logout);
routes.get('/balance/:id', UserController.postgresGetUserBalance);
export default routes;
