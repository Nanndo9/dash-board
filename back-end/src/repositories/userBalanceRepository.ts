import { AppDataSource } from '../data-source';
import { Transaction } from '../entities/Transactions';

export class UserBalanceRepository {
    async getUserBalance(userId: string) {
        const result = await AppDataSource.getRepository(Transaction)
            .createQueryBuilder('transaction')
            .select([
                "SUM(CASE WHEN transaction.type = 'EARNING' THEN transaction.amount ELSE 0 END) AS earnings",
                "SUM(CASE WHEN transaction.type = 'EXPENSE' THEN transaction.amount ELSE 0 END) AS expenses",
                "SUM(CASE WHEN transaction.type = 'INVESTMENT' THEN transaction.amount ELSE 0 END) AS investments",
                "SUM(CASE WHEN transaction.type = 'EARNING' THEN transaction.amount ELSE 0 END) - SUM(CASE WHEN transaction.type = 'EXPENSE' THEN transaction.amount ELSE 0 END) - SUM(CASE WHEN transaction.type = 'INVESTMENT' THEN transaction.amount ELSE 0 END) AS balance"
            ])
            .where('transaction.user_id = :userId', { userId })
            .getRawOne();

        return result;
    }
}