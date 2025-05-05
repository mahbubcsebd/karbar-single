/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import PreLoader from '@/_components/PreLoader';
import SectionTitle from '@/_components/SectionTitle';
import useDictionary from '@/_hooks/useDictionary';
import useFetchData from '@/_hooks/useFetchData';
import { getProduct } from '@/_utils/getProduct';
import ProductCard from './ProductCard';

const RelatedProducts = ({ slug }) => {
    const { language, dictionary } = useDictionary();

    // Fetching product data
    const {
        data: product,
        loading: productLoading,
        error: productError,
    } = useFetchData(getProduct, [language, slug]);

    // Handle loading, error, and empty product
    if (productLoading) return <PreLoader />;
    if (productError) return <p>Error loading product: {productError}</p>;
    if (!product) return <p>No product found</p>;
    if (product.related_products.length < 1) return null;

    return (
        <div
            id="product-section"
            className="mb-10 product-section"
        >
            <div className="product-area">
                <div className="container">
                    <SectionTitle title={dictionary.RelatedProducts.relatedTitle} />
                    <div className="product-list grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 xl:grid-cols-4 xl:gap-[30px] ">
                        {product.related_products.map((product) => {
                            return (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RelatedProducts;
