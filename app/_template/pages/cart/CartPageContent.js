'use client';

import KarbarButton from '@/_components/KarbarButton';
import { ProductContext } from '@/_context/cartContext';
import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { IoTrashOutline } from 'react-icons/io5';

const CartPageContent = () => {
  const { state, dispatch } = useContext(ProductContext);
  const { siteSetting } = useSiteSetting();
  const { dictionary } = useDictionary();
  const { cartItems, cartTotal } = state;

  const {
    pageTitle,
    tableProduct,
    tableName,
    tableQuantity,
    tablePrice,
    tableTotal,
    tableAction,
    tableEmpty,
    tableSubTotal,
    tableCheckout,
  } = dictionary.Cart;

  const handleRemove = (id, variant_id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id, variant_id } });
  };

  const handleIncrement = (id, variant_id) => {
    dispatch({ type: 'INCREMENT_QUANTITY', payload: { id, variant_id } });
  };

  const handleDecrement = (id, variant_id) => {
    dispatch({ type: 'DECREMENT_QUANTITY', payload: { id, variant_id } });
  };

  return (
    <div className="my-10 cart-page">
      <div className="container">
        <div className="max-w-5xl px-4 py-10 mx-auto bg-white rounded-xl">
          <h1 className="mb-6 text-2xl font-bold text-gray-800 md:text-3xl">
            <span className="inline-block mr-2">🛒</span>
            {pageTitle}
          </h1>

          {cartItems.length === 0 ? (
            <div className="py-20 text-lg text-center text-gray-500">
              {tableEmpty}
            </div>
          ) : (
            <>
              {/* Responsive Table Wrapper */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[720px]">
                  <thead>
                    <tr className="text-xs text-gray-900 border-b md:text-sm">
                      <th className="py-3">{tableProduct}</th>
                      <th className="py-3">{tableName}</th>
                      <th className="py-3 text-center">{tableQuantity}</th>
                      <th className="py-3 text-right">{tablePrice}</th>
                      <th className="py-3 text-right">{tableTotal}</th>
                      <th className="py-3 text-center">{tableAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {cartItems.map((item) => {
                      const price =
                        item.sale_price > 0 ? item.sale_price : item.unit_price;
                      return (
                        <tr
                          key={`${item.id}_${item.variant_id}`}
                          className="text-xs text-gray-800 md:text-sm"
                        >
                          <td className="py-4">
                            <Link
                              href={`/products/${item.slug}`}
                              className="relative block w-16 h-16 overflow-hidden bg-gray-100 rounded md:w-24 md:h-24"
                            >
                              <Image
                                src={item.preview_image}
                                alt={item.name}
                                layout="fill"
                                objectFit="cover"
                              />
                            </Link>
                          </td>

                          <td className="py-4 max-w-[220px] md:max-w-[300px]">
                            <Link href={`/products/${item.slug}`}>
                              <div className="font-semibold transition-all duration-150 hover:underline hover:text-blue-600">
                                {item.name}
                              </div>
                            </Link>

                            {/* Variant Attributes */}
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              {Object.entries(item.attributes || {}).map(
                                ([key, value]) => {
                                  const isColorKey =
                                    key.toLowerCase() === 'color';
                                  const isHexColor = /^#?[0-9A-F]{6}$/i.test(
                                    value
                                  );

                                  if (isColorKey && isHexColor) {
                                    return (
                                      <div key={key}>
                                        <div
                                          className="w-4 h-4 rounded-full shadow-md border border-gray-400 p-[2px]"
                                          style={{
                                            backgroundColor: value.startsWith(
                                              '#'
                                            )
                                              ? value
                                              : `#${value}`,
                                          }}
                                        ></div>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <p
                                        key={key}
                                        className="text-[10px] bg-gray-900 text-white py-[2px] px-2 rounded-md leading-4"
                                      >
                                        {value}
                                      </p>
                                    );
                                  }
                                }
                              )}
                            </div>
                          </td>

                          <td className="py-4 text-center">
                            <div className="inline-flex items-center overflow-hidden border rounded-md">
                              <button
                                onClick={() =>
                                  handleDecrement(item.id, item.variant_id)
                                }
                                className="w-8 h-8 text-lg bg-gray-200 hover:bg-gray-300"
                              >
                                −
                              </button>
                              <span className="w-10 font-medium text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleIncrement(item.id, item.variant_id)
                                }
                                className="w-8 h-8 text-lg bg-gray-200 hover:bg-gray-300"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="py-4 font-semibold text-right">
                            {siteSetting.currency_icon || '৳'} {price}
                          </td>
                          <td className="py-4 font-semibold text-right">
                            {siteSetting.currency_icon || '৳'}{' '}
                            {price * item.quantity}
                          </td>
                          <td className="py-4 text-center">
                            <button
                              onClick={() =>
                                handleRemove(item.id, item.variant_id)
                              }
                              className="text-xl text-gray-400 hover:text-red-500"
                              aria-label="Remove item"
                            >
                              <IoTrashOutline />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Subtotal + Checkout */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t md:flex-row">
                <p className="text-base font-semibold text-gray-800 md:text-lg">
                  {tableSubTotal}:
                </p>
                <p className="text-base font-semibold text-gray-800 md:text-lg">
                  {siteSetting.currency_icon || '৳'}
                  {cartTotal}
                </p>
              </div>

              <div className="flex justify-end mt-6">
                <KarbarButton
                  asLink
                  variant="default"
                  href="/checkout"
                  className="px-[30px] py-3 text-sm md:text-base rounded-md"
                >
                  {tableCheckout}
                </KarbarButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPageContent;
