/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

const useFetchData = (apiFunction, apiParams = [], defaultData = null) => {
    const [data, setData] = useState(defaultData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await apiFunction(...apiParams);
                setData(result.data);
            } catch (error) {
                setError(error.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiFunction, ...apiParams]);

    return { data, loading, error };
};

export default useFetchData;
