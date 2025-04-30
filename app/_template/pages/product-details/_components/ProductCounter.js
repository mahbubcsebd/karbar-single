"use client"

import { ProductContext } from '@/context/cartContext';
import { useContext, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';


const ProductCounter = ({
    id,
    productCount,
    setProductCount,
    stock,
    setShowStockMsg,
    productStock,
    showStock,
    incrementDisable,
    setIncrementDisable,
    variants,
}) => {
    // const [incrementDisable, setIncrementDisable] = useState(false);
    const [decrementDisable, setDecrementDisable] = useState(false);

    const { state, dispatch } = useContext(ProductContext);

    const handleRemoveFromCart = (id) => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            payload: id,
        });
        const product = cartItems.find((item) => item.id === id);
        toast.success(`Removed ${product.title} from Cart!`, {
            position: 'bottom-right',
        });
    };

    const handleIncrementQuantity = (id) => {
        setProductCount((prevProductCount) => {
            const newProductCount = prevProductCount + 1;
            if (newProductCount > productStock) {
                return productStock;
            }
            return newProductCount;
        });

        if (productCount === productStock) {
            setShowStockMsg(true);
            setIncrementDisable(true);
        }
    };

    const handleDecrementQuantity = (id) => {
        if (productCount > 1) {
            setProductCount(productCount - 1);
        }

        if (productCount <= productStock) {
            setShowStockMsg(false);
            setIncrementDisable(false);
        }

        // dispatch({
        //     type: 'DECREMENT_QUANTITY',
        //     payload: id,
        // });
    };

    const handleClearCart = () => {
        dispatch({
            type: 'CLEAR_CART',
        });
        toast.success(`Removed all product from Cart!`, {
            position: 'bottom-right',
        });
    };

    return (
        <div className="flex justify-between items-center w-[112px] h-14 border border-gray-400 rounded-md">
            <button
                type="button"
                onClick={() => handleDecrementQuantity(id)}
                disabled={decrementDisable}
                className={`flex items-center justify-center h-full w-[40px] text-gray-600 ${
                    decrementDisable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
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
                onClick={() => handleIncrementQuantity(id)}
                disabled={
                    variants.length > 0
                        ? incrementDisable ||
                          stock < 1 ||
                          (productStock < 1 && showStock)
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

export default ProductCounter