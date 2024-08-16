import { useState, useEffect } from 'react';
import { Appbar } from '../components/Appbar';
import { Balance } from '../components/Balance';
import { Users } from '../components/Users';
import { Loading } from '../components/Loading';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

export const Dashboard = () => {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    // console.log(id);
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const token = localStorage.getItem('token');     //token is stored in localStorage
                const decoded = jwtDecode(token);

                setUserId(decoded.userId);
                // State updates in React are asynchronous, and thus you can't rely on userId being updated right after calling setUserId.
                const response = await axios.post('http://localhost:3000/api/v1/account/balance', {
                    userId: decoded.userId
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setBalance(response.data.balance); // Ensure response data structure matches this line
                setLoading(false);
            } catch (e) {
                setError(e);
                setLoading(false);
            }
        };

        fetchBalance();
    }, []);

    if (loading) return <><Loading type={"bars"} color={"blue"}/></>;
    if (error) return <div>Error fetching balance: {error.response.data.message}</div>;

    return (
        <div>
            <Appbar />
            <div className="m-8">
                {balance !== null && <Balance value={balance} />}
                <Users id={userId}/>
            </div>
        </div>
    );
};
