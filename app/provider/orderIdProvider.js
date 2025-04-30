'use client';

import { useState } from 'react';
import OrderIdContext from '../context/orderIdContext';

export const OrderProvider = ({ children }) => {
    const [orderId, setOrderId] = useState(null);

    return (
        <OrderIdContext.Provider value={{ orderId, setOrderId }}>
            {children}
        </OrderIdContext.Provider>
    );
};

export default OrderProvider;
