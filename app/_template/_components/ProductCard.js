'use client';

import { ProductContext } from '@/_context/cartContext';
import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import noAvailableImg from '@/assets/icons/no-available.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { dictionary } = useDictionary();
  const { siteSetting } = useSiteSetting();

  const { priceCurrency, seeDetails } = dictionary.ProductCard;

  const { uuid, name, preview_image, sale_price, unit_price, stock, slug } =
    product;

  const { state, dispatch } = useContext(ProductContext);

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
  }

  return (
    <div className="h-full overflow-hidden product-card group rounded-lg bg-white border border-[rgba(0, 0, 0, 0.30)]">
      <Link
        href={`/products/${slug}`}
        className="block product-image h-[180px] sm:h-[373px] md:h-[286px] lg:h-[270px] xl:h-[344px] 1xl:h-[270px] 2xl:h-[320px] rounded-tl-lg rounded-tr-lg overflow-hidden relative"
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
            className={`absolute top-3 left-3 px-[10px] py-[6px] rounded-full text-[10px] bg-white shadow-md`}
          >
            <p className="text-[#484848]">
              {calculateDiscount(unit_price, sale_price)}% Off
            </p>
          </div>
        )}
        {stock < 1 && (
          <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full text-xl text-center text-white bg-black z-99 opacity-70">
            Out of stock
          </div>
        )}
      </Link>
      <div className="product-content p-[10px] md:p-[18px] text-center">
        <Link
          href={`/products/${slug}`}
          className="block mb-1 text-xs font-medium text-gray-900 sm:text-base lg:text-base xl:text-lg md:mb-2 product-title ellipsis-2 xl:min-h-14 hover:text-[#348E29] transition-all duration-150 capitalize"
        >
          {name}
        </Link>
        <p className="product-price text-sm sm:text-base xl:text-lg font-semibold text-gray-900 mb-[18px]">
          {sale_price > 0 && (
            <span>{`${siteSetting.currency_icon || '৳'}${sale_price}`}</span>
          )}{' '}
          <span
            className={`inline-block ${
              sale_price > 0
                ? 'line-through text-red-700 text-xs md:text-sm'
                : ''
            }`}
          >
            {`${siteSetting.currency_icon || '৳'}${unit_price}`}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
