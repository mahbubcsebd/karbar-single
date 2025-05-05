'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import './hero.css';

import useDictionary from '@/_hooks/useDictionary';
import dynamic from 'next/dynamic';
import { useMemo, useRef } from 'react';
import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6';

// Lazy import ProductCard to optimize performance
const ProductCard = dynamic(() => import('../../../_components/ProductCard'), {
    ssr: false,
});

const SingleHomeCategories = ({ category }) => {
    const { dictionary } = useDictionary();
    const swiperRef = useRef(null);

    const { key, categories } = category;

    // Memoize the product list to prevent unnecessary re-renders
    const renderedProducts = useMemo(
        () =>
            categories.map((product) => (
                <SwiperSlide key={product.id}>
                    <ProductCard product={product} />
                </SwiperSlide>
            )),
        [categories]
    );

    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 capitalize md:text-4xl">
                    {key}
                </h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        type="button"
                        className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-base rounded-full flex justify-center items-center text-gray-900 bg-gray-300`}
                        aria-label="slider prev button"
                    >
                        <FaArrowLeftLong />
                    </button>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        type="button"
                        className="flex items-center justify-center w-8 h-8 text-xs text-gray-900 bg-gray-300 rounded-full sm:w-10 sm:h-10 sm:text-base"
                        aria-label="slider next button"
                    >
                        <FaArrowRightLong />
                    </button>
                </div>
            </div>
            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                pagination={{ clickable: true }}
                navigation={{
                    nextEl: `.swiper-button-next-${key}`,
                    prevEl: `.swiper-button-prev-${key}`,
                }}
                onBeforeInit={(swiper) => {
                    swiperRef.current = swiper;
                }}
                breakpoints={{
                    320: { slidesPerView: 2, spaceBetween: 16 },
                    768: { slidesPerView: 3, spaceBetween: 16 },
                    1280: { slidesPerView: 5, spaceBetween: 16 },
                }}
            >
                {renderedProducts}
            </Swiper>
        </div>
    );
};

export default SingleHomeCategories;
