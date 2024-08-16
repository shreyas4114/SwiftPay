import { Link } from "react-router-dom";

export const Appbar = () => {
    return (
        <div className="shadow-md h-16 flex justify-between items-center px-6 bg-white border-b border-gray-200">
            <div className="text-2xl font-bold text-gray-800">
                PayTM App
            </div>
            
            <div className="flex items-center space-x-4">
                <Link to="/transactions">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                        Transactions
                    </button>
                </Link>
                <div className="text-gray-700 text-lg font-medium">
                    Hello
                </div>
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-800">
                        U
                    </div>
                    {/* Add a notification bubble or any other user-related icon if needed */}
                </div>
            </div>
        </div>
    );
};
