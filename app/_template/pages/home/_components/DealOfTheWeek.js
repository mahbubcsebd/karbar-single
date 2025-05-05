/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import KarbarButton from '@/_components/KarbarButton';
import useDictionary from '@/_hooks/useDictionary';
import { getAllProduct } from '@/_utils/getProduct';
import fresh from '@/assets/images/fresh.png';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DaribProductLoader from '../../../_components/DaribProductLoader';
import ProductCard from '../../../_components/ProductCard';
import SectionTitle from '../../../_components/SectionTitle';

const DealOfTheWeek = () => {
  const { language, dictionary } = useDictionary();
  const { sectionTitle, seeMore } = dictionary.ProductCard;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await getAllProduct(
          language,
          'all',
          '',
          'new_arrival',
          '',
          1,
          4
        );
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err.message);
        setError('Failed to fetch products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [language]);

  return (
    <div className="product-section min-h-[820px]">
      <div className="relative pb-20 product-area">
        <div className="container">
          {/* <SectionTitle title={sectionTitle} /> */}
          <SectionTitle
            position="start"
            title="Deal Of The Week"
          />

          {loading ? (
            <DaribProductLoader items={8} />
          ) : error ? (
            <div className="text-red-500 text-center min-h-[300px] flex items-center justify-center">
              {error}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid items-stretch grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                {products.map((product, index) => (
                  <div
                    className="col-span-1"
                    key={product.id}
                  >
                    <ProductCard
                      product={product}
                      isPriority={index < 4}
                    />
                  </div>
                ))}
                <div className="flex flex-col h-full col-span-2 gap-4">
                  <div className="flex flex-col flex-1 h-full gap-4  max-h-[453px]">
                    <Link
                      href="/collections/all"
                      className="flex-1 overflow-hidden rounded-lg"
                    >
                      <Image
                        src={fresh}
                        alt="Featured Product"
                        width={500}
                        height={500}
                        className="w-full h-full rounded-lg"
                        loading="lazy"
                        priority={false}
                      />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-10 md:pt-[70px]">
                <KarbarButton
                  asLink
                  href="/collections/all"
                  preserveHover
                  variant="default"
                  className="text-base md:text-[20px] font-medium border md:border-2 px-6 py-[10px] md:px-[30px] md:py-4 transition duration-150 rounded-full"
                  aria-label="See more products in our collection"
                  title="Browse all products in our collection"
                >
                  {seeMore ?? 'See More'}
                </KarbarButton>
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center min-h-[300px] flex items-center justify-center">
              No products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealOfTheWeek;