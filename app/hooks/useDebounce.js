// import { useEffect, useRef, useState } from 'react';

// export const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);  

//   const timeoutRef = useRef(null);

//   useEffect(() => {
//     if (timeoutRef.current !== null) {
//       clearTimeout(timeoutRef.current);
//     }

//     timeoutRef.current = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     // Cleanup function to clear timeout if component unmounts prematurely
//     return () => {
//       if (timeoutRef.current !== null) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, [value, delay]);

//   return debouncedValue;
// };


import { useEffect, useRef } from 'react';

export const useDebounce = (callback, delay) => {
    const timeoutIdRef = useRef(null);

    useEffect(() => {
        // Cleanup function to clear the timeout on unmount
        return () => {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, []);

    const debouncedCallback = (...args) => {
        // Clear any existing timeout before scheduling a new one
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
        }

        timeoutIdRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    };

    return debouncedCallback;
};