// context/SearchContext.js
import { createContext, useState } from 'react';

const BrandContext = createContext('');

export const BrandProvider = ({ children }) => {
    const [brandQuery, setBrandQuery] = useState('all');

    return (
        <BrandContext.Provider value={{ brandQuery, setBrandQuery }}>
            {children}
        </BrandContext.Provider>
    );
};

export default BrandContext;
