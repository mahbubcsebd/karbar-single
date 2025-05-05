import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import { getAllProduct } from '@/_utils/getProduct';
import noAvailableImg from '@/assets/icons/no-available.svg';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}


const SearchResult = ({ search, closeSearchResults }) => {
    const [gridClass, setGridClass] = useState('');
    const [products, setProducts] = useState([]);
    const { language } = useDictionary();
    const debouncedSearch = useDebounce(search, 500);
    const { siteSetting } = useSiteSetting();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productsData = await getAllProduct(
                    language,
                    "all",
                    '',
                    null,
                    debouncedSearch
                );
                setProducts(productsData.data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }

            console.log("fetching product")
        };

        if (debouncedSearch) {
            fetchProduct();
        }
    }, [language, debouncedSearch]);

    useEffect(() => {
        const numberOfProducts = products.length;

        let newGridClass = '';

        switch (numberOfProducts) {
            case 1:
                newGridClass = 'grid grid-cols-1 w-[300px] lg:w-[350px]';
                break;
            case 2:
                newGridClass =
                    'grid grid-cols-1 md:grid-cols-2 w-[300px] lg:w-[700px]';
                break;
            case 3:
                newGridClass =
                    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  w-[300px] lg:w-[1050px]';
                break;
            default:
                newGridClass =
                    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-[300px] lg:w-[1050px]';
                break;
        }

        setGridClass(newGridClass);
        console.log('Number product' + numberOfProducts);
    }, [products.length]);

    return (
        <div className="absolute left-[10px] xl:left-1/2 xl:-translate-x-1/2 top-[70px] lg:top-[74px] z-999 rounded-md bg-white p-4 shadow-sm min-w-[300px] lg:min-w-full">
            <div className="">
                <p className="mb-4 text-base font-normal text-gray-700">
                    Search results for
                    <span className="mx-2 font-semibold">{`"${search}"`}</span>
                </p>
                {products.length > 0 ? (
                    <ul
                        role="list"
                        className={`${gridClass} gap-2 max-h-[230px] overflow-y-auto search-scroll`}
                    >
                        {products.map((product) => (
                            <li key={product.id}>
                                <Link
                                    href={`/products/${product.slug}`}
                                    onClick={(e) => closeSearchResults(e)}
                                    className="flex gap-4 p-1 rounded-md hover:bg-gray-200"
                                >
                                    <div>
                                        <div className="w-16 h-16 overflow-hidden rounded-md">
                                            <Image
                                                src={
                                                    product.preview_image
                                                        ? product.preview_image
                                                        : noAvailableImg
                                                }
                                                alt={name}
                                                width={64}
                                                height={64}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="mb-1 text-base font-normal text-gray-900 ellipsis-1">
                                            {product.name}
                                        </h1>
                                        <p className="text-xs font-semibold text-gray-900 product-price">
                                            Price :{' '}
                                            {product.sale_price > 0 && (
                                                <span>
                                                    {`${siteSetting.currency_icon || '৳'}${product.sale_price}`}
                                                </span>
                                            )}{' '}
                                            <span
                                                className={`inline-block ${
                                                    product.sale_price > 0
                                                        ? 'line-through text-red-500 text-[10px]'
                                                        : ''
                                                }`}
                                            >
                                                {`${siteSetting.currency_icon || '৳'}${product.unit_price}`}
                                            </span>
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="w-full">
                        <p>No product found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResult;
