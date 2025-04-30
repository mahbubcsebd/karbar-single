'use client';

import Link from 'next/link';
import { useContext } from 'react';
// import { useContext } from "react";
import noAvailableImg from '@/assets/icons/no-available.svg';
import KarbarButton from '@/components/KarbarButton';
import { ProductContext } from '@/context/cartContext';
import useDictionary from '@/hooks/useDictionary';
import useSiteSetting from '@/hooks/useSiteSetting';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import RatingReadOnly from './RatingReadOnly';
// import { ProductContext } from "../context/cartContext";

const ProductCard = ({ product, isPriority }) => {
  const { dictionary } = useDictionary();
  const { siteSetting } = useSiteSetting();

  const { priceCurrency, seeDetails } = dictionary.ProductCard;

  const {
    uuid,
    name,
    preview_image,
    sale_price,
    unit_price,
    stock,
    slug,
    product_rating,
  } = product;

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

  return (
    <div className="overflow-hidden bg-white rounded-lg">
      <div className="relative">
        <Link
          href={`/products/${slug}`}
          className="inline-block w-full overflow-hidden rounded-lg"
        >
          <div className="w-full h-[200px] bg-gray-100">
            <Image
              src={preview_image ?? noAvailableImg}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover w-full h-full"
              loading={isPriority ? 'eager' : 'lazy'}
              priority={isPriority}
              quality={75}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNFMEUwRTAiIC8+PC9zdmc+"
            />
          </div>
          {stock < 1 && (
            <div className="absolute inset-0 flex items-center justify-center text-xl text-white bg-black bg-opacity-80">
              Out of stock
            </div>
          )}
        </Link>
      </div>

      {/* Fixed height content area */}
      <div className="flex flex-col justify-between p-[10px] md:p-[18px] bg-white">
        <div>
          <Link
            href={`/products/${slug}`}
            className="block mb-1 text-xs font-bold text-gray-900 capitalize sm:text-base md:mb-2 ellipsis-2 xl:min-h-12"
          >
            {name}
          </Link>
          <p dir="ltr" className="block mb-3 text-sm font-bold text-gray-600 uppercase rtl:text-right">
            1 KG
          </p>
          <RatingReadOnly rating={product_rating || 5} />
          <p  dir="ltr" className="product-price text-xs sm:text-base xl:text-lg font-semibold text-gray-900 mb-[18px] pt-1 rtl:text-right">
            {sale_price > 0 && (
              <span>{`${siteSetting.currency_icon || '৳'}${sale_price}`}</span>
            )}{' '}
            <span
              className={`inline-block ${
                sale_price > 0 ? 'line-through text-red-700 text-sm' : ''
              }`}
            >
              {`${siteSetting.currency_icon || '৳'}${unit_price}`}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <KarbarButton
            asLink
            href={`/products/${slug}`}
            className="w-full text-center py-[10px] px-5 text-[10px] sm:text-base md:text-xs lg:text-base font-normal rounded-[4px] capitalize bg-[#D1EFD4] hover:bg-[#17AF26] text-[#17AF26] hover:text-white border border-[#D1EFD4] hover:border-[#17AF26] transition-all duration-300 ease-in-out flex justify-center items-center gap-2"
          >
            <ShoppingCart />{' '}
            {siteSetting.button_text ? siteSetting.button_text : 'Add To Cart'}
          </KarbarButton>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
