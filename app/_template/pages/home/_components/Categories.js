'use client';

import SortContext from '@/_context/SortContext';
import useDictionary from '@/_hooks/useDictionary';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';

const Categories = () => {
    const { dictionary } = useDictionary();
    const { newArrival, bestSelling, discount } = dictionary.ProductCard.SortBy;
    const { setSortQuery } = useContext(SortContext);
    const router = useRouter();

    const handleCategoryClick = (sort) => {
        setSortQuery(sort);
        router.push('/collections/all');
    };

    const categoriesList = [
        { label: newArrival, value: 'new_arrival' },
        { label: bestSelling, value: 'best_selling' },
        { label: discount, value: 'discount' },
    ];

    return (
        <div className="categories">
            <div className="bg-white border-t border-gray-400 categories-area">
                <div className="container">
                    <ul className="flex flex-wrap items-center justify-center gap-6 py-4">
                        {categoriesList.map((item) => (
                            <li key={item.value}>
                                <button
                                    onClick={() =>
                                        handleCategoryClick(item.value)
                                    }
                                    className="text-base font-normal text-gray-600 transition duration-150 hover:text-gray-800"
                                    aria-label={`Sort by ${item.label}`}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Categories;
