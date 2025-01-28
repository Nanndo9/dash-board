import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import routes from './users';

const routerTransaction = Router();

routerTransaction.post('/transactions', TransactionController.createTransaction);
routerTransaction.get('/transactions', TransactionController.getTransactionsByUserId);
routerTransaction.patch('/transactions/:id', TransactionController.updateTransaction);
routerTransaction.delete('/transactions/:id', TransactionController.deleteTransaction);
export default routerTransaction;