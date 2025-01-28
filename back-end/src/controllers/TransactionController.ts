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


    static async getTransactionsByUserId(req: Request, res: Response) {
        try {
            const userId = req.query.userId as string;

            const transactions = await transactionRepository.find({
                where: { user: { id: userId } },
                relations: ['user'],
            });

            if (!transactions || transactions.length === 0) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json({ message: 'No transactions found for this user' });
            }

            return res.status(HttpStatus.OK).json(transactions);
        } catch (error) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error when seeking transactions' });
        }
    }

    static async updateTransaction(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, date, amount, type } = req.body;
            const transaction = await transactionRepository.findOne({ where: { id } });

            if (!transaction) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json({ message: 'Transaction not found' });
            }

            transaction.name = name;
            transaction.date = date;
            transaction.amount = amount;
            transaction.type = type;

            await transactionRepository.save(transaction);

            return res.status(HttpStatus.OK).json(transaction);
        } catch (error: any) {
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error when updating transaction', error });
        }
    }
    static async deleteTransaction(req: Request, res: Response) {
        try{
            const { id } = req.params;
            const transaction = await transactionRepository.findOne({ where: { id } });

            if (!transaction) {
                return res
                    .status(HttpStatus.NOT_FOUND)
                    .json({ message: 'Transaction not found' });
            }

            await transactionRepository.delete(transaction);

            return res.status(HttpStatus.OK).json({ message: 'Transaction deleted' });
        }catch(error: any){
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error when deleting transaction', error });
        }
    }
}
