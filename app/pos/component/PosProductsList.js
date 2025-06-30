'use client';

import useDictionary from '@/_hooks/useDictionary';
import usePosUser from '@/_hooks/usePosUser';
import useStoreId from '@/_hooks/useStoreId';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { IoFilterSharp } from 'react-icons/io5';
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
  const [page, setPage] = useState(1);
  const [totalProduct, setTotalProduct] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSeeMoreClick, setIsSeeMoreClick] = useState(false);
  const { language, dictionary } = useDictionary();
  const [categories, setCategories] = useState([]);
  const searchParams = useSearchParams();
  const { authToken, setAuthToken } = useAuth();
  const loaderRef = useRef(null);
  const { posUser } = usePosUser();
  const [storeId, setStoreId] = useState(posUser?.store_id);
  const [availableStock, setAvailableStock] = useState(true);
  const { userStoreId, setUserStoreId } = useStoreId();

  const token = searchParams.get('token');

  useEffect(() => {
    setAuthToken(token);
    setPageLoading(false);
  }, [token]);

  const handleAvailableStock = () => {
    setAvailableStock((prev) => !prev);
    setProductItem([]);
    setPage(1);
  };

  const fetchProduct = useCallback(
    async (reset = false) => {
      try {
        if (authToken && storeId) {
          setLoading(true);
          const currentPage = reset ? 1 : page;

          const productsData = await getPosProductProducts(
            authToken,
            selectedCategory,
            search,
            currentPage,
            12,
            storeId,
            availableStock
          );

          const newProducts = productsData.data;
          setTotalProduct(productsData.meta.total);

          if (reset || currentPage === 1) {
            setProductItem(newProducts);
          } else {
            setProductItem((prevItems) => [...prevItems, ...newProducts]);
          }

          if (reset) setPage(1);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setLoading(false);
      }
    },
    [authToken, storeId, availableStock, selectedCategory, search, page]
  );

  useEffect(() => {
    if (authToken) {
      getPosCategories(authToken)
        .then((categoriesData) => {
          if (categoriesData.message === 'Unauthenticated') {
            setAuthenticated(false);
          } else {
            setCategories(categoriesData.data);
          }
        })
        .catch((error) => console.error('Failed to fetch categories:', error));
    }
  }, [authToken]);

  useEffect(() => {
    if (storeId && authToken) {
      setProductItem([]);
      setPage(1);
      setTotalProduct(0);
      fetchProduct(true);
    }
  }, [storeId, availableStock, authToken]);

  useEffect(() => {
    if (!loaderRef.current || productItem.length >= totalProduct || loading)
      return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
        setIsSeeMoreClick(true);
      }
    });

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading, productItem.length, totalProduct]);

  useEffect(() => {
    if (page > 1 && !loading) {
      fetchProduct();
    }
  }, [page]);

  const handleCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setPage(1);
    setProductItem([]);
    fetchProduct(true);
  };

  const handleAllFilter = () => {
    setSelectedCategory('');
    setPage(1);
    setProductItem([]);
    fetchProduct(true);
  };

  if ((!authenticated && authToken) || (!authToken && !pageLoading)) {
    return (
      <div className="container">
        <div className="min-h-[calc(100vh-120px)] flex items-center justify-center bg-white rounded-[16px]">
          <p className="text-3xl font-semibold text-gray-500">
            You are not authorized. Please Login
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pb-8">
      <div className="grid grid-cols-12 gap-[30px]">
        <div className="order-2 col-span-12 xl:col-span-7 xl:order-1">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1">
              <PosSearch
                search={search}
                setSearch={setSearch}
                products={productItem}
              />
            </div>
            <button
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                availableStock
                  ? 'bg-purple-900 text-white'
                  : 'bg-white text-gray-500'
              }`}
              onClick={handleAvailableStock}
            >
              <IoFilterSharp />
            </button>
          </div>

          <div className="flex gap-4 px-3 py-2 mb-5 bg-white rounded product-filter">
            <button
              onClick={handleAllFilter}
              className={`px-4 py-3 text-sm rounded-md ${
                selectedCategory === ''
                  ? 'bg-[#E7ECF2] text-purple-900'
                  : 'text-gray-700'
              }`}
            >
              {dictionary.Global.all}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategory(category.id)}
                className={`px-4 py-3 text-sm rounded-md ${
                  selectedCategory === category.id
                    ? 'bg-[#E7ECF2] text-purple-900'
                    : 'text-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <Suspense fallback={<></>}>
            {loading && !isSeeMoreClick ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 2xl:grid-cols-4">
                <PosSkeletonCard />
                <PosSkeletonCard />
                <PosSkeletonCard />
                <PosSkeletonCard />
              </div>
            ) : productItem.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-4">
                {productItem.map((product, index) => (
                  <PosProductCard key={index} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center pt-10 text-gray-600">
                <h2 className="text-2xl">Product not found</h2>
              </div>
            )}

            <div ref={loaderRef} className="flex justify-center mt-40">
              {loading && productItem.length < totalProduct && (
                <div className="loader"></div>
              )}
            </div>
          </Suspense>
        </div>

        <div className="order-1 col-span-12 xl:col-span-5 xl:order-2">
          <div className="p-5 bg-white rounded-xl">
            <CustomerList
              customervalue={customervalue}
              setCustomerValue={setCustomerValue}
              warehousevalue={warehousevalue}
              setWarehouseValue={setWarehouseValue}
              setStoreId={setStoreId}
              storeId={storeId}
              setPage={setPage}
            />
            <BillTable
              customervalue={customervalue}
              setCustomerValue={setCustomerValue}
              warehousevalue={warehousevalue}
              setWarehouseValue={setWarehouseValue}
              refetchProducts={() => fetchProduct(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosProductsList;
