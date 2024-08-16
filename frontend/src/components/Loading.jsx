import React from 'react';
import ReactLoading from 'react-loading';

export const Loading = ({ type, color }) => (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <ReactLoading type={type} color={color} height={'5%'} width={'5%'} />
        <p className="mt-4 text-xl font-semibold" style={{ color: color }}>
            Loading...
        </p>
    </div>
);
