// import { AdContext } from '@/context/AdContext';
import { AdContext } from '@/context/adContext';
import { useContext } from 'react';

const useAdManager = () => {
    const { adManager } = useContext(AdContext);
    return { adManager };
};

export default useAdManager;
