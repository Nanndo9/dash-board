import { Request, Response } from 'express';
import { userRepository } from '../repositories/userRepository';
import { transactionRepository } from '../repositories/transactionRepository';
import { HttpStatus } from '../enums/htppStatus';

export class TransactionController {
    static async createTransaction(req: Request, res: Response) {
        try {
            const { userId, name, date, amount, type } = req.body;
            const user = await userRepository.findOneBy({ id: userId });

            if (!user) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json({ message: 'User not found' });
            }

            const transaction = transactionRepository.create({
                user,
                name,
                date,
                amount,
                type,
            });
            await transactionRepository.save(transaction);

            return res.status(HttpStatus.CREATED).json(transaction);
        } catch (error: any) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error when creating transaction', error });
        }
    }

    static async getAllTransactions(_: Request, res: Response) {
        try {
            const transactions = await transactionRepository.find();
            return res.status(HttpStatus.OK).json(transactions);
        } catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Erro ao buscar transações', error });
        }
    }
}
