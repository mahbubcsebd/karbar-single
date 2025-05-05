'use client';

import useDictionary from '@/_hooks/useDictionary';
import { getCategoryWiseProduct } from '@/_utils/getProduct';
import dynamic from 'next/dynamic';
import { Suspense, useEffect, useMemo, useState } from 'react';

// Lazy import SingleHomeCategories for better performance
const SingleHomeCategories = dynamic(() => import('./SingleHomeCategories'), {
    ssr: false, // Only load on the client side
});

const HomeCategories = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { language } = useDictionary();

    useEffect(() => {
        let isMounted = true; // Prevents state updates on unmounted components

        const fetchCategory = async () => {
            setIsLoading(true);
            try {
                const categoriesData = await getCategoryWiseProduct(language);
                if (isMounted) {
                    setCategories(categoriesData.data);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchCategory();

        return () => {
            isMounted = false; // Cleanup to prevent memory leaks
        };
    }, [language]);

    // Memoized Skeleton Loader to prevent unnecessary re-renders
    const skeletons = useMemo(
        () =>
            Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={`skeleton-${index}`}
                    className="bg-gray-200 rounded-lg animate-pulse"
                    style={{ minHeight: '300px', marginBottom: '1rem' }}
                />
            )),
        []
    );

    return (
        <div>
            <div className="home-categories">
                <div className="home-categories-area">
                    <div className="container">
                        {isLoading ? (
                            skeletons
                        ) : (
                            <Suspense fallback={skeletons}>
                                {categories.map((category) => (
                                    <SingleHomeCategories
                                        key={category.key}
                                        category={category}
                                    />
                                ))}
                            </Suspense>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeCategories;
