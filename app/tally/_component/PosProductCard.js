'use client';

// import { useContext } from "react";
import useDictionary from '@/_hooks/useDictionary';
import noAvailableImg from '@/assets/icons/no-available.svg';
import Image from 'next/image';
import usePos from '../../_hooks/usePos';
// import { ProductContext } from "../context/cartContext";

const PosProductCard = ({ product }) => {
    const { dictionary } = useDictionary();

    const { priceCurrency, seeDetails } = dictionary.ProductCard;

    const {
        product_id,
        product_name_with_attr,
        unit_price,
        sale_price,
        preview_image,
        variant_id,
        attribute_one_name,
        attribute_group_one_name,
        attribute_two,
        attribute_two_name,
        attribute_group_two_name,
        barcode_or_sku_code,
        quantity,
        warehouse_name,
    } = product;

    const { state, dispatch } = usePos();
    const isInCart = state.posCartItems.some(
        (item) => item.barcode_or_sku_code === product.barcode_or_sku_code
    );

    const selectedProduct = { ...product, quantity: 1 };


    const handleAddToCart = (name) => {
        // Check if the product is already in the cart
        const productInCart = state.posCartItems.find(
            (item) =>
                item.barcode_or_sku_code === product.barcode_or_sku_code
        );

        if (productInCart) {
            // Increment the quantity of the existing product
            const updatedCartItems = state.posCartItems.map((item) => {
                if (
                    item.barcode_or_sku_code ===
                    product.barcode_or_sku_code
                ) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });

            dispatch({
                type: 'INCREMENT_QUANTITY',
                payload: name,
            });
        } else {
            // Add the product to the cart if it's not already there
            dispatch({
                type: 'ADD_TO_CART',
                payload: selectedProduct,
            });
        }
    };



    return (
        <div className="h-full overflow-hidden bg-white rounded-lg product-card">
            <button
                onClick={() => handleAddToCart(barcode_or_sku_code)}
                disabled={quantity <= 0}
                className="block w-full h-[122px] rounded-tl-lg rounded-tr-md
                        overflow-hidden relative cursor-pointer"
            >
                <Image
                    src={preview_image ? preview_image : noAvailableImg}
                    alt={name}
                    width={270}
                    height={320}
                    className="object-cover w-full h-full"
                />
                <div
                    className={`absolute top-1 right-1 p-[6px] rounded-full text-[8px] text-white ${
                        quantity > 0 ? 'bg-[#28A745]' : 'bg-[#F44336]'
                    }`}
                >
                    <p>
                        {quantity > 0 ? `${quantity} In Stock` : 'Out of stock'}
                    </p>
                </div>
            </button>
            <div className="product-content p-[6px] bg-white">
                <button
                    onClick={() => handleAddToCart(barcode_or_sku_code)}
                    disabled={quantity <= 0}
                    className="block mb-1 text-sm font-medium text-gray-900 product-title ellipsis-2 text-left"
                >
                    {product_name_with_attr}
                </button>
                <p className="product-price text-[10px] font-semibold text-gray-900">
                    {priceCurrency} :{' '}
                    {sale_price === 0 ? unit_price : sale_price}
                </p>
            </div>
        </div>
    );
};

export default PosProductCard;
