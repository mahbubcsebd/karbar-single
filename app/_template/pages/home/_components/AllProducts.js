/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import KarbarButton from '@/_components/KarbarButton';
import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import { getAllCategories } from '@/_utils/categories';
import { getAllProduct } from '@/_utils/getProduct';
import ourProductsbg from '@/assets/images/our-product-bg-4.svg';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from '../../../_components/ProductCard';
import SkeletonCard from '../../../_components/SkeletonCard';

const AllProducts = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProduct, setShowProduct] = useState(12);
  const [productItem, setProductItem] = useState([]);
  const [page, setPage] = useState(1);
  const [totalProduct, setTotalProduct] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState();
  const [loading, setLoading] = useState(false);
  const [isSeeMoreClick, setIsSeeMoreClick] = useState(false);
  const { language, dictionary } = useDictionary();
  const [categories, setCategories] = useState([]);
  const { siteSetting } = useSiteSetting();

  const buttonBgColor = siteSetting?.btn_bg_color || '#348E29';

  const memoizedProductsArray = useMemo(() => {
    return productItem;
  }, [productItem]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoriesData = await getAllCategories(language);
        setCategories(categoriesData.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchCategory();
  }, [language]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productsData = await getAllProduct(
          language,
          selectedCategory,
          '',
          'all',
          '',
          page,
          showProduct
        );
        const newProducts = productsData.data;
        setTotalProduct(productsData.meta.total);

        if (page === 1) {
          setProductItem(newProducts);
        } else {
          setProductItem((prevItems) => [...prevItems, ...newProducts]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [language, selectedCategory, page]);

  const handleCategory = useCallback((categoryName) => {
    setIsSeeMoreClick(false);
    setSelectedCategory(categoryName);
    setPage(1);
  }, []);

  const handleAllFilter = useCallback(() => {
    setPage(1);
    setProductItem([]);
    setSelectedCategory('all');
  }, []);

  const handleSeeMore = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
    setIsSeeMoreClick(true);
  }, []);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };

    container.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div id="product-section" className="product-section">
      <div className="relative pb-20 product-area">
        <Image
          src={ourProductsbg}
          alt="bg"
          className="absolute top-0 left-0 z-[-1] w-full h-full object-cover object-center"
        />
        <div className="container">
          <div className="flex justify-center md:mb-[70px] mb-6"></div>
          <div className="product-filter flex flex-col md:flex-row justify-between md:items-center gap-2 mb-[30px]">
            <h2 className="text-2xl font-semibold text-gray-800 capitalize md:text-4xl">
              {dictionary.TemplateFour.our}
              <span
                style={{ color: siteSetting?.btn_bg_color }}
                className="text-[#348E29]"
              >
                {' '}
                {dictionary.TemplateFour.product}
              </span>
            </h2>
            <ul
              ref={scrollContainerRef}
              className="flex items-center gap-[2px] p-1 border border-gray-800 rounded-full max-w-[100%] md:max-w-[500px] overflow-x-auto categories-scroll"
            >
              <li>
                <button
                  onClick={handleAllFilter}
                  type="button"
                  className={`whitespace-nowrap px-3 py-1 md:px-4 md:py-[10px] md:text-sm xl:px-5 xl:py-2 text-xs xl:text-base font-normal text-gray-800 rounded-full transition duration-150 ${
                    selectedCategory == 'all'
                      ? `bg-[${buttonBgColor}] text-white`
                      : ''
                  }`}
                  style={{
                    backgroundColor:
                      selectedCategory == 'all' ? buttonBgColor : '',
                    color: selectedCategory == 'all' ? 'white' : '',
                  }}
                >
                  {dictionary.Global.all}
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => handleCategory(category.slug)}
                    type="button"
                    className={`whitespace-nowrap px-3 py-1 md:px-4 md:py-[10px] md:text-sm xl:px-5 xl:py-2 text-xs xl:text-base font-normal text-gray-800 rounded-full transition duration-150 ${
                      selectedCategory == category.slug
                        ? `bg-[${buttonBgColor}] text-white`
                        : ''
                    }`}
                    style={{
                      backgroundColor:
                        selectedCategory == category.slug ? buttonBgColor : '',
                      color: selectedCategory == category.slug ? 'white' : '',
                    }}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {loading && !isSeeMoreClick ? (
            <div className="product-list grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-[30px]">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : memoizedProductsArray.length > 0 ? (
            <div className="product-list grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-[30px]">
              {memoizedProductsArray.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center pt-10 text-gray-600">
              {memoizedProductsArray.length < 1 && !loading && (
                <h2 className="text-2xl font-normal">
                  {dictionary.Global.noFound}
                </h2>
              )}
            </div>
          )}
          <div className="flex justify-center md:pt-[70px] mt-6">
            <KarbarButton
              asLink
              href={`/collections/${selectedCategory}`}
              preserveHover={true}
              variant="default"
              className="text-base md:text-[20px] font-medium border md:border-2 px-6 py-[10px] md:px-[30px] md:py-4 transition duration-150 rounded-full"
              aria-label={`See more products in our collection`}
              title="Browse all products in our collection"
            >
              {loading ? 'Loading...' : dictionary.Global.seeMore}
            </KarbarButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
