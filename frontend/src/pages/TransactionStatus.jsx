import { useLocation } from 'react-router-dom';

export const TransactionStatus = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const status = params.get('status'); // Either 'success' or 'failed'
    const message = params.get('message'); // Optional message parameter

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
                <h2 className="text-3xl font-bold mb-4">
                    {status === 'success' ? 'Payment Successful!' : 'Payment Failed!'}
                </h2>
                <p className="text-gray-600 mb-6">
                    {status === 'success'
                        ? 'Your payment was processed successfully. Thank you!'
                        : message || 'There was an issue processing your payment. Please try again.'}
                </p>
                <a
                    href="/dashboard"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                    Back to Dashboard
                </a>
            </div>
        </div>
    );
};
