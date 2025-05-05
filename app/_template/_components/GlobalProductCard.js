'use client';

import Link from 'next/link';
import { useContext, useEffect, useRef, useState } from 'react';
// import { useContext } from "react";
import KarbarButton from '@/_components/KarbarButton';
import { ProductContext } from '@/_context/cartContext';
import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import noAvailableImg from '@/assets/icons/no-available.svg';
import Image from 'next/image';
import { toast } from 'react-toastify';
// import { ProductContext } from "@/_context/cartContext";

const GlobalProductCard = ({ product }) => {
    const productCardRef = useRef(null);
    const [width, setWidth] = useState(0);
    const { dictionary } = useDictionary();
    const { siteSetting, loading, error } = useSiteSetting();

    const { priceCurrency, seeDetails } = dictionary.ProductCard;

    useEffect(() => {
        if (productCardRef.current) {
            setWidth(productCardRef.current.offsetWidth);
        }
    }, []);

    const { uuid, name, preview_image, sale_price, unit_price, stock, slug } =
        product;

    const { state, dispatch } = useContext(ProductContext);

    // const isInCart = state.cartItems.some((item) => item.id === product.id);

    const selectedProduct = { ...product, quantity: 1 };

    // Handle Add To Cart
    const handleAddToCart = () => {
        if (!isInCart) {
            dispatch({
                type: 'ADD_TO_CART',
                payload: selectedProduct,
            });
            toast.success(`Added ${product.name} to Cart!`, {
                position: 'bottom-right',
            });
        } else {
            toast.error(
                `The product ${product.name} has already been added to the cart`,
                {
                    position: 'bottom-right',
                }
            );
        }
    };

    function calculateDiscount(unitPrice, salePrice) {
        const discount = ((unitPrice - salePrice) / unitPrice) * 100;
        return Math.round(discount);
        // return discount % 1 === 0 ? discount.toFixed(0) : discount.toFixed(2);
    }

    return (
        <div
            ref={productCardRef}
            className="h-full overflow-hidden bg-white rounded-lg product-card"
        >
            <Link
                href={`/products/${slug}`}
                className="block product-image h-[180px] sm:h-[373px] md:h-[232px] lg:h-[306px] xl:h-[281px] 1xl:h-[417px] 2xl:h-[337px] rounded-tl-lg rounded-tr-lg overflow-hidden relative"
            >
                <Image
                    src={preview_image ? preview_image : noAvailableImg}
                    alt={name}
                    width={270}
                    height={320}
                    className="object-cover w-full h-full"
                />
                {sale_price > 0 && (
                    <div
                        className={`absolute top-3 left-3 px-[14px] py-[10px] rounded-full text-[10px] bg-white shadow-md`}
                    >
                        {calculateDiscount(unit_price, sale_price)}% Off
                    </div>
                )}
                {stock < 1 && (
                    <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full text-xl text-center text-white bg-black z-99 opacity-80">
                        Out of stock
                    </div>
                )}
            </Link>
            <div className="product-content p-[10px] md:p-[18px] bg-white">
                <Link
                    href={`/products/${slug}`}
                    className="block mb-1 text-xs font-medium text-gray-900 capitalize sm:text-base lg:text-base xl:text-lg md:mb-2 product-title ellipsis-2 xl:min-h-14"
                >
                    {name}
                </Link>
                <p className="product-price text-xs sm:text-base xl:text-lg font-semibold text-gray-900 mb-[18px]">
                    {sale_price > 0 && (
                        <span>{`${siteSetting.currency_icon || '৳'}${sale_price}`}</span>
                    )}{' '}
                    <span
                        className={`inline-block ${
                            sale_price > 0
                                ? 'line-through text-red-700 text-sm'
                                : ''
                        }`}
                    >
                        {`${siteSetting.currency_icon || '৳'}${unit_price}`}
                    </span>
                </p>
                <div className="flex items-center gap-2">
                    <KarbarButton
                        asLink
                        href={`/products/${slug}`}
                        className="w-full block text-center py-[10px] px-5 md:py-4 text-[10px] sm:text-base md:text-xs lg:text-base font-normal rounded-[4px]"
                    >
                        {siteSetting.button_text
                            ? siteSetting.button_text
                            : 'Order Now'}
                    </KarbarButton>
                </div>
            </div>
        </div>
    );
};

export default GlobalProductCard;
