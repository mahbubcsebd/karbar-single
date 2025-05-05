'use client';

import { ProductContext } from '@/_context/cartContext';
import useSiteSetting from '@/_hooks/useSiteSetting';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const OurPackages = ({ package_title, products }) => {
    const [selectedValues, setSelectedValues] = useState({});
    const { state, dispatch } = useContext(ProductContext);
    const { siteSetting } = useSiteSetting();

    // Clear cartItems on initial load
    useEffect(() => {
        dispatch({
            type: 'CLEAR_CART', // Ensure you have a case in the reducer to handle this
        });
    }, [dispatch]);

    const [selectedProducts, setSelectedProducts] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedProducts = localStorage.getItem('selectedProducts');
            return storedProducts ? JSON.parse(storedProducts) : [];
        }
        return [];
    });

    // Check if a product is already in the cart
    const isInCart = (productId) => {
        return state.cartItems.some((item) => item.id === productId);
    };

    const handleProductSelect = (product) => {
        if (isProductSelectable(product.id)) {
            let updatedSelectedProducts;

            if (
                selectedProducts.some((selected) => selected.id === product.id)
            ) {
                // Product is already selected, remove it from the selected products and the cart
                updatedSelectedProducts = selectedProducts.filter(
                    (selected) => selected.id !== product.id
                );
                setSelectedProducts(updatedSelectedProducts);

                // Dispatch action to remove the product from the cart
                dispatch({
                    type: 'REMOVE_FROM_CART',
                    payload: product.id, // Make sure you have this case in your reducer
                });
            } else {
                // Product is not selected, add it to selected products and the cart
                updatedSelectedProducts = [...selectedProducts, product];
                setSelectedProducts(updatedSelectedProducts);

                const selectedProductWithVariants = {
                    ...product,
                    quantity: 1,
                    attributes: selectedValues[product.id] || {},
                };

                // Dispatch action to add the product to the cart
                dispatch({
                    type: 'ADD_TO_CART',
                    payload: selectedProductWithVariants,
                });
            }
        } else {
            toast.error(`Please select the product variants`, {
                position: 'bottom-right',
            });
        }
    };

    // Check if all required variants are selected
    const isProductSelectable = (productId) => {
        const selectedVariants = selectedValues[productId] || {};
        const product = products.find((p) => p.id === productId);

        const hasColorVariant = product.variants.some((v) => v.color);
        const hasSizeVariant = product.variants.some((v) => v.size);

        const colorSelected = hasColorVariant ? selectedVariants.color : true;
        const sizeSelected = hasSizeVariant ? selectedVariants.size : true;

        return colorSelected && sizeSelected;
    };

    // Handle variant change (radio buttons)
    const handleChange = (key, productId, value) => {
        // Check if the product is already selected
        const isProductSelected = selectedProducts.some(
            (selected) => selected.id === productId
        );

        // Update the selected variant values
        setSelectedValues((prevSelectedValues) => {
            const updatedSelectedValues = {
                ...prevSelectedValues,
                [productId]: {
                    ...prevSelectedValues[productId],
                    [key]: value,
                },
            };

            // If the product is already selected, remove it from the cart and selected products
            if (isProductSelected) {
                const updatedSelectedProducts = selectedProducts.filter(
                    (selected) => selected.id !== productId
                );
                setSelectedProducts(updatedSelectedProducts);

                // Dispatch action to remove the product from the cart
                dispatch({
                    type: 'REMOVE_FROM_CART',
                    payload: productId, // Ensure this exists in your reducer
                });
            }

            return updatedSelectedValues;
        });
    };

    // useEffect(() => {
    //     console.log('Selected Products:', selectedProducts);
    //     console.log('Selected Values:', selectedValues);
    // }, [selectedProducts, selectedValues]);

    // if (!products) {
    //     return (
    //         <div>
    //             <p>Products is empty</p>
    //         </div>
    //     )
    // }
    return (
        <div
            id="our-package-section"
            className="our-package-section"
        >
            <div className="container">
                <div className="our-package-area bg-white lg:rounded-[20px] p-4 rounded-lg lg:p-10 ">
                    {/* <h4 className="text-2xl lg:text-[30px] text-gray-900 font-semibold mb-[18px] text-center">
                        Our Package
                    </h4> */}
                    <div
                        dangerouslySetInnerHTML={{
                            __html: package_title,
                        }}
                        className="mb-[18px]"
                    />
                    <ul className="grid lg:grid-cols-2 gap-[30px]">
                        {products.map((product) => (
                            <li key={product.id}>
                                <label
                                    htmlFor={product.id}
                                    className="flex items-center gap-2 md:gap-[18px] p-3 md:py-5 md:px-[30px] w-full bg-[#F1F1F1] border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        id={product.id}
                                        name="product"
                                        value={product.id}
                                        // checked={selectedProducts.some(
                                        //     (selected) =>
                                        //         selected.id === product.id
                                        // )}
                                        checked={isInCart(product.id)}
                                        onChange={() =>
                                            handleProductSelect(product)
                                        }
                                        className="shrink-0 mt-0.5 border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none form-checkbox h-5 w-5"
                                        disabled={
                                            !isProductSelectable(product.id)
                                        }
                                    />
                                    <div
                                        className={`flex items-start gap-[14px]`}
                                    >
                                        <div>
                                            <div className="w-[90px] h-[104px] sm:w-[95px] sm:h-[112px] md:w-[110px] md:h-[118px] lg:w-[84px] lg:h-[90px] xl:w-[100px] xl:h-[100px] rounded-lg overflow-hidden">
                                                <Image
                                                    className="object-cover w-full h-full"
                                                    src={product.preview_image}
                                                    alt={product.name}
                                                    width={100}
                                                    height={100}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-auto">
                                            <div className="flex justify-between items-baseline gap-4 mb-[10px]">
                                                <h2
                                                    className="text-sm sm:text-base lg:text-[20px] text-gray-800 font-semibold ellipsis-2 h-10 sm:h-12 md:h-[54px] leading-relaxed"
                                                    title={product.name}
                                                >
                                                    {product.name}
                                                </h2>
                                                <p className="flex items-center gap-1 text-sm font-normal text-gray-600">
                                                    <span className="font-semibold text-gray-800">
                                                        {siteSetting.currency_icon || '৳'}
                                                    </span>{' '}
                                                    {product.unit_price}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-6 mb-2">
                                                <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
                                                    {product.variants.map(
                                                        (
                                                            variant,
                                                            variantIndex
                                                        ) => {
                                                            const key =
                                                                Object.keys(
                                                                    variant
                                                                )[0];
                                                            const values =
                                                                variant[key];

                                                            return (
                                                                <div
                                                                    key={
                                                                        variantIndex
                                                                    }
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <div>
                                                                        <p className="text-[10px] font-semibold text-gray-700 capitalize">
                                                                            {
                                                                                key
                                                                            }
                                                                            :
                                                                        </p>
                                                                    </div>
                                                                    <ul className="flex items-center gap-[6px] flex-wrap">
                                                                        {values.map(
                                                                            (
                                                                                value,
                                                                                index
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                >
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`${key}-${product.id}`}
                                                                                        id={`${key}-${value}-${product.id}`}
                                                                                        value={
                                                                                            value
                                                                                        }
                                                                                        className="hidden"
                                                                                        checked={
                                                                                            selectedValues[
                                                                                                product
                                                                                                    .id
                                                                                            ]?.[
                                                                                                key
                                                                                            ] ===
                                                                                            value
                                                                                        }
                                                                                        onChange={() =>
                                                                                            handleChange(
                                                                                                key,
                                                                                                product.id,
                                                                                                value
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                    {key.toLowerCase() ===
                                                                                    'color' ? (
                                                                                        <label
                                                                                            htmlFor={`${key}-${value}-${product.id}`}
                                                                                            className={`cursor-pointer rounded-full p-[2px] flex items-center justify-center shadow-lg border ${
                                                                                                selectedValues[
                                                                                                    product
                                                                                                        .id
                                                                                                ]?.[
                                                                                                    key
                                                                                                ] ===
                                                                                                value
                                                                                                    ? 'border-red-500'
                                                                                                    : 'border-gray-500'
                                                                                            }`}
                                                                                        >
                                                                                            <div
                                                                                                style={{
                                                                                                    backgroundColor: `#${value}`,
                                                                                                }}
                                                                                                className={`w-5 h-5 rounded-full`}
                                                                                            ></div>
                                                                                        </label>
                                                                                    ) : (
                                                                                        <label
                                                                                            htmlFor={`${key}-${value}-${product.id}`}
                                                                                            className={`px-[10px] py-1 text-[9px] font-medium rounded block cursor-pointer border border-gray-600 ${
                                                                                                selectedValues[
                                                                                                    product
                                                                                                        .id
                                                                                                ]?.[
                                                                                                    key
                                                                                                ] ===
                                                                                                value
                                                                                                    ? 'bg-gray-600 text-white'
                                                                                                    : 'text-gray-600 hover:text-white hover:bg-gray-700'
                                                                                            }`}
                                                                                        >
                                                                                            {
                                                                                                value
                                                                                            }
                                                                                        </label>
                                                                                    )}
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OurPackages;
