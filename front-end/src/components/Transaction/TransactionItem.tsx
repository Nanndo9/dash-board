import axios from 'axios';
import { useEffect, useState } from 'react';

interface TransactionItemProps {
    id: number;
    amount: number;
    date: string;
    description: string;
}

const TransactionItem = ({ id, amount, date, description }: TransactionItemProps) => {
    return (
        <div className="transaction-item">
            <p>ID: {id}</p>
            <p>Amount: {amount}</p>
            <p>Date: {date}</p>
            <p>Description: {description}</p>
        </div>
    );
};

export const TransactionList = () => {
    const [transactions, setTransactions] = useState<TransactionItemProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get('http://localhost:3000/transactions')
            .then(response => {
                setTransactions(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the transactions!', error);
                setError('There was an error fetching the transactions.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            {transactions.length > 0 ? (
                transactions.map(transaction => (
                    <TransactionItem key={transaction.id} {...transaction} />
                ))
            ) : (
                <div>No transactions found.</div>
            )}
        </div>
    );
};

export default TransactionList;