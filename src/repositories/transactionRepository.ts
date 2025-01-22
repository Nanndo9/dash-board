import { AppDataSource } from "../data-source";
import { Transaction } from "../entities/Transactions";
export const transactionRepository = AppDataSource.getRepository(Transaction);