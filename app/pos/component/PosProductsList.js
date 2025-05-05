/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import useDictionary from '@/_hooks/useDictionary';
import { useSearchParams } from 'next/navigation';
import {
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import useAuth from '../../_hooks/useAuth';
import { getPosCategories } from '../../_utils/pos/getPosCategories';
import { getPosProductProducts } from '../../_utils/pos/getPosProducts';
import BillTable from './BillTable';
import CustomerList from './CustomerList';
import PosProductCard from './PosProductCard';
import PosSearch from './PosSearch';
import PosSkeletonCard from './PosSkeletonCard';

const PosProductsList = () => {
    const [search, setSearch] = useState('');
    const [customervalue, setCustomerValue] = useState('');
    const [warehousevalue, setWarehouseValue] = useState('');

    const [selectedCategory, setSelectedCategory] = useState('');
    const [showProduct, setShowProduct] = useState(12);
    const [productItem, setProductItem] = useState([]);
    const [authenticated, setAuthenticated] = useState(true);
    const [posAuth, setPosAuth] = useState(true);
    const [page, setPage] = useState(1);
    const [totalProduct, setTotalProduct] = useState(0);
    const [selectedProducts, setSelectedProducts] = useState();
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [isSeeMoreClick, setIsSeeMoreClick] = useState(false);
    const { language, dictionary } = useDictionary();
    const [categories, setCategories] = useState([]);
    const searchParams = useSearchParams();
    const { authToken, setAuthToken } = useAuth();
    const loaderRef = useRef(null);

    const token = searchParams.get('token');

    useEffect(() => {
        setAuthToken(token);
        setPageLoading(false);
    }, [token]);

    const memoizedProductsArray = useMemo(() => {
        return productItem;
    }, [productItem]);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                if (authToken) {
                    const categoriesData = await getPosCategories(authToken);
                    if (categoriesData.message === 'Unauthenticated') {
                        setAuthenticated(false);
                    } else {
                        setCategories(categoriesData.data);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategory();
    }, [authToken]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (authToken) {
                    setLoading(true);
                    const productsData = await getPosProductProducts(
                        authToken,
                        selectedCategory,
                        search,
                        page,
                        12
                    );
                    const newProducts = productsData.data;
                    setTotalProduct(productsData.meta.total);

                    if (page === 1) {
                        setProductItem(newProducts);
                    } else {
                        setProductItem((prevItems) => [
                            ...prevItems,
                            ...newProducts,
                        ]);
                    }

                    setLoading(false);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [search, selectedCategory, authToken, page]);

    const handleSeeMore = useCallback(() => {
        setPage((prevPage) => prevPage + 1);
        setIsSeeMoreClick(true);
    }, []);

    useEffect(() => {
        if (productItem.length >= totalProduct) {
            if (loaderRef.current) {
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        observer.unobserve(loaderRef.current);
                    }
                });
            }
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loading) {
                handleSeeMore();
            }
        });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [loading, productItem.length, totalProduct, handleSeeMore]);

    const handleCategory = async (categoryName) => {
        setIsSeeMoreClick(false);
        setSelectedCategory(categoryName);
        setPage(1);
    };

    const handleAllFilter = async (categoryName) => {
        setPage(1);
        setProductItem([]);
        setSelectedCategory('');
    };

    // useEffect(() => {
    //     if (!authToken) {
    //         setPosAuth(false);
    //     }
    // });

    if ((!authenticated && authToken) || (!authToken && !pageLoading)) {
        return (
            <div className="">
                <div className="container">
                    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-white rounded-[16px]">
                        <p className="text-3xl font-semibold text-gray-500">
                            You are not authorized. Please Login
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-8">
            <div className="px-5">
                <div className="grid grid-cols-12 gap-[30px] ">
                    <div className="order-2 col-span-12 xl:col-span-7 xl:order-1">
                        <div className="mb-5">
                            <PosSearch
                                search={search}
                                setSearch={setSearch}
                                products={productItem}
                            />
                        </div>
                        <div className="product-filter items-start flex lg:items-center gap-4 sm:gap-5 mb-[20px] bg-white rounded py-[6px] px-3">
                            <ul className="flex items-center flex-wrap gap-2 sm:gap-3 md:gap-[18px]">
                                <li>
                                    <button
                                        onClick={handleAllFilter}
                                        type="button"
                                        className={`px-4 py-3 text-sm font-normal text-gray-700 rounded-md hover:bg-[#E7ECF2] hover:text-purple-900 transition duration-150 ${
                                            selectedCategory === ''
                                                ? 'bg-[#E7ECF2] text-purple-900'
                                                : ''
                                        }`}
                                    >
                                        {dictionary.Global.all}
                                    </button>
                                </li>
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <button
                                            onClick={() =>
                                                handleCategory(category.id)
                                            }
                                            type="button"
                                            className={`px-4 py-3 text-sm font-normal text-gray-700 rounded-md hover:bg-[#E7ECF2] hover:text-purple-900 transition duration-150 ${
                                                selectedCategory == category.id
                                                    ? 'bg-[#E7ECF2] text-purple-900'
                                                    : ''
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Suspense fallback={<h2></h2>}>
                            {loading && !isSeeMoreClick ? (
                                <div className="grid grid-cols-2 gap-4 product-list sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    <PosSkeletonCard />
                                    <PosSkeletonCard />
                                    <PosSkeletonCard />
                                    <PosSkeletonCard />
                                </div>
                            ) : memoizedProductsArray.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3 product-list sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {memoizedProductsArray.map(
                                        (product, index) => (
                                            <PosProductCard
                                                key={index}
                                                product={product}
                                            />
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="flex justify-center pt-10 text-gray-600">
                                    {memoizedProductsArray.length < 1 &&
                                        !loading && (
                                            <h2 className="text-2xl font-normal">
                                                Product not found
                                            </h2>
                                        )}
                                </div>
                            )}
                            {/* Loader element for infinite scroll */}
                            <div
                                ref={loaderRef}
                                className="flex justify-center mt-40"
                            >
                                {loading &&
                                    productItem.length < totalProduct && (
                                        <div className="loader"></div>
                                    )}
                            </div>
                        </Suspense>
                    </div>
                    <div className="order-1 col-span-12 xl:col-span-5 xl:order-2">
                        <div className="bg-white rounded-xl p-[18px]">
                            <div className="mb-8">
                                <CustomerList
                                    customervalue={customervalue}
                                    setCustomerValue={setCustomerValue}
                                    warehousevalue={warehousevalue}
                                    setWarehouseValue={setWarehouseValue}
                                />
                            </div>
                            <BillTable
                                customervalue={customervalue}
                                setCustomerValue={setCustomerValue}
                                warehousevalue={warehousevalue}
                                setWarehouseValue={setWarehouseValue}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PosProductsList;
