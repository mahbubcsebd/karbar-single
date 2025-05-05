'use client';

import { useEffect, useState } from 'react';
import { AdContext } from '../_context/adContext';
import getAddManager from '../_utils/getAddManager';

export const AdProvider = ({ children }) => {
    const [adManager, setAdManager] = useState(null);

    useEffect(() => {
        const fetchAdManager = async () => {
            const response = await getAddManager();
            setAdManager(response);
        }

        fetchAdManager();
    },[])


    return (
        <AdContext.Provider value={{ adManager }}>
            {children}
        </AdContext.Provider>
    );
};

export default AdProvider;
