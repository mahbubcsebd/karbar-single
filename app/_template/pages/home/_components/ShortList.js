"use client";

import SortContext from '@/_context/SortContext';
import useDictionary from '@/_hooks/useDictionary';
import { getAllProduct } from '@/_utils/getProduct';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import SingleShorts from './SingleShorts';

const ShortList = () => {
  const { dictionary, language } = useDictionary();
  const { newArrival, bestSelling, discount } = dictionary.ProductCard.SortBy;
  const { setSortQuery } = useContext(SortContext);
  const router = useRouter();

  const [featuredlProducts, setFeaturedlProducts] = useState([]);
  const [newArrivalProducts, setNewArrivalProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);

  const handleCategoryClick = (sort) => {
    setSortQuery(sort);
    router.push('/collections/all');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [
          featuredlProductsData,
          newArrivalData,
          discountData,
          bestSellingData,
        ] = await Promise.all([
          getAllProduct(language, 'all', '', 'all', '', 1, 4, 'all'),
          getAllProduct(language, 'all', '', 'new_arrival', '', 1, 4, 'all'),
          getAllProduct(language, 'all', '', 'discount', '', 1, 4, 'all'),
          getAllProduct(language, 'all', '', 'best_selling', '', 1, 4, 'all'),
        ]);

        setFeaturedlProducts(featuredlProductsData.data);
        setNewArrivalProducts(newArrivalData.data);
        setDiscountProducts(discountData.data);
        setBestSellingProducts(bestSellingData.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [language]);

  const shortListData = [
    {
      id: 1,
      title: 'Featured Products',
      sort: 'all',
      products: featuredlProducts,
    },
    {
      id: 2,
      title: newArrival,
      sort: 'new_arrival',
      products: newArrivalProducts,
    },
    {
      id: 3,
      title: bestSelling,
      sort: 'best_selling',
      products: bestSellingProducts,
    },
    {
      id: 4,
      title: discount,
      sort: 'discount',
      products: discountProducts,
    },
  ];

  return (
    <div className="mb-10 short-list-section">
      <div className="container">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {shortListData.map((item) => (
            <SingleShorts
              key={item.id}
              title={item.title}
              products={item.products}
              sort={item.sort}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShortList;
