import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useState } from 'react';

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name") || "";
    const [amount, setAmount] = useState(0);
    const navigate = useNavigate();

    const handleTransfer = async () => {
        try {
            await axios.post("http://localhost:3000/api/v1/account/transfer", {
                to: id,
                amount
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            navigate(`/transaction-status?status=success`);
        } catch (error) {
            const message = error.response?.data?.message || "An unexpected error occurred";
            navigate(`/transaction-status?status=failed&message=${encodeURIComponent(message)}`);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-3xl font-bold text-center mb-6">Send Money</h2>
                <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-2xl text-white mr-4">
                        {name ? name[0].toUpperCase() : ""}
                    </div>
                    <h3 className="text-2xl font-semibold">{name}</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label
                            className="block text-sm font-medium text-gray-700"
                            htmlFor="amount"
                        >
                            Amount (in Rs)
                        </label>
                        <input
                            onChange={(e) => setAmount(e.target.value)}
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            id="amount"
                            placeholder="Enter amount"
                        />
                    </div>
                    <button
                        onClick={handleTransfer}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        Initiate Transfer
                    </button>
                </div>
            </div>
        </div>
    );
}
