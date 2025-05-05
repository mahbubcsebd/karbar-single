// context/SearchContext.js
import { createContext, useState } from 'react';

const SortContext = createContext('');

export const SortProvider = ({ children }) => {
    const [sortQuery, setSortQuery] = useState(null);

    return (
        <SortContext.Provider value={{ sortQuery, setSortQuery }}>
            {children}
        </SortContext.Provider>
    );
};

export default SortContext;
