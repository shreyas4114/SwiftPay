import { useState, useEffect } from 'react';
import { Loading } from '../components/Loading';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';

export const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const decoded = jwtDecode(token);

                setUserId(decoded.userId);

                const response = await axios.post("http://localhost:3000/api/v1/account/history", {
                    userId: decoded.userId
                }, {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                });

                setTransactions(response.data.transactions);
                setLoading(false);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    alert(error.response.data.message);
                } else {
                    alert('An error occurred. Please try again.');
                }
                setLoading(false);
            }
        }

        fetchHistory();
    }, []);

    if (loading) return <Loading type="bars" color="blue" />;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
                    <Link to="/dashboard" className="text-blue-500 hover:underline">
                        Back to Dashboard
                    </Link>
                </div>
                <div>
                    {transactions.length > 0 ? (
                        transactions.map(transaction => (
                            <Transaction key={transaction.id} transaction={transaction} userId={userId} />
                        ))
                    ) : (
                        <p className="text-gray-600 text-center">No transactions found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function Transaction({ transaction, userId }) {
    const isReceived = transaction.to === userId;
    const amountClass = isReceived ? 'text-green-600' : 'text-red-600';
    const bgColorClass = isReceived ? 'bg-green-50' : 'bg-red-50';
    const localTime = moment(transaction.time).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');

    return (
        <div className={`flex justify-between items-center p-4 border-b ${bgColorClass}`}>
            <div className="flex-1">
                <p className="font-semibold text-gray-800">{isReceived ? transaction.fromName : transaction.toName}</p>
                <p className="text-sm text-gray-600">Transaction ID: {transaction.id}</p>
                <p className="text-sm text-gray-600">Time: {localTime}</p>
            </div>
            <div className={`text-lg ${amountClass}`}>
                {isReceived ? '+' : '-'}{transaction.amount}
            </div>
        </div>
    );
}
