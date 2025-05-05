'use client';

import SortContext from '@/_context/SortContext';
import useDictionary from '@/_hooks/useDictionary';
import { getAllCategories } from '@/_utils/categories';
import vegetables from '@/assets/icons/vegetable.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

// 🔸 Skeleton Placeholder Component
const SkeletonCategory = () => (
  <ul className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 xl:grid-cols-10 xxl:grid-cols-12 gap-3 py-5 lg:py-10 xl:gap-[21px] xxl:gap-6 md:py-16">
    {Array.from({ length: 10 }).map((_, index) => (
      <li key={index}>
        <div className="block w-full text-center animate-pulse">
          <div className="w-full mb-1 bg-gray-200 rounded-lg aspect-square lg:mb-3"></div>
          <div className="w-3/4 h-3 mx-auto bg-gray-300 rounded"></div>
        </div>
      </li>
    ))}
  </ul>
);

const Categories = () => {
  const { dictionary, language } = useDictionary();
  const { setSortQuery } = useContext(SortContext);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories(language);
        setCategoryList(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [language]);

  return (
    <div className="categories">
      <div className="bg-white border-t border-gray-400 categories-area">
        <div className="container">
          {loading ? (
            <SkeletonCategory />
          ) : (
            <ul className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 xl:grid-cols-10 xxl:grid-cols-12 gap-3 py-5 lg:py-10 xl:gap-[21px] xxl:gap-6 md:py-16">
              {categoryList.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/collections/${category.slug}`}
                    className="block w-full text-center"
                  >
                    <div className="w-full aspect-square bg-[#C0E5C3] rounded-lg mb-1 lg:mb-3 flex items-center justify-center overflow-hidden">
                      <Image
                        src={category?.category_image || vegetables}
                        alt={category.name}
                        className="object-contain w-3/4 h-3/4"
                        width={100}
                        height={100}
                      />
                    </div>
                    <p className="text-xs font-semibold text-gray-800 md:text-sm lg:text-base">
                      {category.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
