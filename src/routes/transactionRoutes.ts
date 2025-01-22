import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';

const routerTransaction = Router();

routerTransaction.post('/transactions', TransactionController.createTransaction);
routerTransaction.get('/transactions', TransactionController.getAllTransactions);
routerTransaction.get('/transactions/:id', TransactionController.getTransactionsByUserId);

export default routerTransaction;