'use client';

import { ProductContext } from '@/_context/cartContext';
import { useContext, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import { toast } from 'react-toastify';

const ProductCounter = ({
  id,
  variantId,
  productCount,
  setProductCount,
  stock,
  setShowStockMsg,
  productStock,
  showStock,
  incrementDisable,
  setIncrementDisable,
  variants = [],
}) => {
  const [decrementDisable, setDecrementDisable] = useState(false);
  const { state, dispatch } = useContext(ProductContext);
  const { cartItems } = state;

  const getCartItem = () =>
    cartItems.find((item) => item.id === id && item.variant_id === variant_id);

  const handleRemoveFromCart = () => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { id, variant_id },
    });

    const product = getCartItem();
    toast.success(`Removed ${product?.title || 'Product'} from Cart!`, {
      position: 'bottom-right',
    });
  };

  const handleIncrementQuantity = () => {
    const newProductCount = productCount + 1;
    if (newProductCount <= productStock) {
      setProductCount(newProductCount);
    }

    if (newProductCount >= productStock) {
      setShowStockMsg(true);
      setIncrementDisable(true);
    }

    dispatch({
      type: 'INCREMENT_QUANTITY',
      payload: { id, variant_id },
    });
  };

  const handleDecrementQuantity = () => {
    if (productCount > 1) {
      setProductCount(productCount - 1);
      dispatch({
        type: 'DECREMENT_QUANTITY',
        payload: { id, variant_id },
      });
    }

    if (productCount <= productStock) {
      setShowStockMsg(false);
      setIncrementDisable(false);
    }
  };

  const handleClearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success(`Removed all products from Cart!`, {
      position: 'bottom-right',
    });
  };

  return (
    <div className="flex justify-between items-center w-[112px] h-14 border border-gray-400 rounded-md">
      <button
        type="button"
        onClick={handleDecrementQuantity}
        disabled={decrementDisable}
        className={`flex items-center justify-center h-full w-[40px] text-gray-600 ${
          decrementDisable
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-100'
        }`}
        aria-label="Decrease quantity"
      >
        <FaMinus className="w-3 h-3" />
      </button>

      <div className="flex items-center justify-center w-[32px] text-gray-600 text-base">
        {productCount}
      </div>

      <button
        type="button"
        onClick={handleIncrementQuantity}
        disabled={
          variants.length > 0
            ? incrementDisable || stock < 1 || (productStock < 1 && showStock)
            : false
        }
        className={`flex items-center justify-center h-full w-[40px] text-gray-600 ${
          incrementDisable || stock < 1 || (productStock < 1 && showStock)
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-100'
        }`}
        aria-label="Increase quantity"
      >
        <FaPlus className="w-3 h-3" />
      </button>
    </div>
  );
};

export default ProductCounter;
