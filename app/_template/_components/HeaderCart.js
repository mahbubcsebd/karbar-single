'use client';

import KarbarButton from '@/_components/KarbarButton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/_components/ui/popover';
import { ProductContext } from '@/_context/cartContext';
import useSiteSetting from '@/_hooks/useSiteSetting';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { BsCart3 } from 'react-icons/bs';
import { RxCross1, RxCrossCircled } from 'react-icons/rx';
import { toast } from 'react-toastify';

const HeaderCart = ({ dictionary }) => {
  const { state, dispatch } = useContext(ProductContext);
  const { siteSetting } = useSiteSetting();
  const { cartItems, cartTotal } = state;
  const { itemsNumber, cartEmpty, total, showAll } = dictionary;

  const [open, setOpen] = useState(false);

  const handleRemoveFromCart = (id, variant_id) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { id, variant_id },
    });

    const product = cartItems.find(
      (item) => item.id === id && item.variant_id === variant_id
    );

    if (product) {
      toast.success(
        `Removed ${product.name} (${product.variant_id}) from Cart!`,
        {
          position: 'bottom-right',
        }
      );
    }
  };

  const handleClosePopover = () => setOpen(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative flex items-center justify-center gap-1  text-lg md:text-[22px] text-gray-800 border border-[#D14BF8] w-10 h-10 md:w-12 md:h-12 rounded-full bg-white"
          onClick={() => setOpen(true)}
          aria-label="cart icon button"
        >
          <BsCart3 />
          {state.cartItems.length > 0 && (
            <span className="w-3 h-3 rounded-full bg-[#FF2848] text-[8px] text-white flex justify-center items-center absolute  top-[7px] right-[6px] lg:top-[9px] lg:right-[10px]">
              {state.cartItems.length}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className={`p-4 z-50 w-[300px] lg:w-[340px] ${
          cartItems.length === 0
            ? 'flex justify-center items-center min-h-[220px]'
            : ''
        }`}
      >
        {cartItems.length === 0 ? (
          <p className="text-sm text-center">{cartEmpty}</p>
        ) : (
          <div>
            <p className="text-lg font-semibold text-gray-700">
              {cartItems.length} {itemsNumber}
            </p>
            <hr className="my-3 border-gray-400" />

            <div
              className={`grid gap-3 ${
                cartItems.length > 2 ? 'max-h-[220px] overflow-y-auto pr-2' : ''
              }`}
            >
              {cartItems.map((product) => (
                <div
                  key={`${product.id}_${product.variant_id}`}
                  className="flex items-start gap-2 pb-3 border-b border-gray-300"
                >
                  <Link
                    href={`/products/${product.slug}`}
                    className="shrink-0"
                    onClick={handleClosePopover}
                  >
                    <div className="w-[45px] h-[45px] lg:w-[50px] lg:h-[50px] rounded-md overflow-hidden">
                      <Image
                        src={product.preview_image}
                        alt={product.name}
                        width={84}
                        height={84}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </Link>

                  <div className="flex flex-col w-full">
                    <div className="flex items-start justify-between">
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={handleClosePopover}
                      >
                        <h2 className="mb-1 text-base font-medium text-gray-800 transition-all duration-150 hover:text-gray-900 ellipsis-2 hover:underline">
                          {product.name}
                        </h2>
                      </Link>
                      <button
                        onClick={() =>
                          handleRemoveFromCart(product.id, product.variant_id)
                        }
                        type="button"
                        className="text-lg text-gray-400"
                        aria-label="Remove from cart"
                      >
                        <RxCrossCircled />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-700">
                        <span>{product.quantity}</span>
                        <span className="text-gray-500">
                          <RxCross1 />
                        </span>
                        <span className="text-[#F93754] font-semibold">
                          {product.sale_price > 0
                            ? product.sale_price
                            : product.unit_price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3">
              <p className="text-base font-semibold text-gray-700">{total} :</p>
              <p className="text-base font-semibold text-gray-700">
                {siteSetting.currency_icon || '৳'} {cartTotal}
              </p>
            </div>

            <div className="pt-3">
              <KarbarButton
                asLink
                variant="default"
                href="/cart"
                className="px-[30px] py-3 text-base rounded-md w-full"
                onClick={handleClosePopover}
              >
                {showAll ?? 'Show All'}
              </KarbarButton>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default HeaderCart;
