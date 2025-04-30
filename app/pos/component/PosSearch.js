import { useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import usePos from '../../hooks/usePos';

const PosSearch = ({ search, setSearch, products }) => {
    const [debouncedValue, setDebouncedValue] = useState(search);
    const { state, dispatch } = usePos();

    // Debouncing logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(debouncedValue);
        }, 500);

        return () => clearTimeout(timer);
    }, [debouncedValue, setSearch]);

    // Automatically add to cart if barcode matches
    useEffect(() => {
        if (!debouncedValue) return;

        const foundProduct = products.find(
            (product) => product.barcode_or_sku_code === debouncedValue
        );

        if (foundProduct) {
            dispatch({
                type: 'ADD_TO_CART',
                payload: { ...foundProduct, quantity: 1 },
            });

            setDebouncedValue(''); // Clear input after adding to cart
        }
    }, [debouncedValue, products, dispatch]);

    const handleInputChange = (event) => {
        setDebouncedValue(event.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', search);
    };

    return (
        <div>
            <form onSubmit={handleSearch} className="relative w-full">
                <input
                    type="text"
                    name="header-search"
                    id="header-search"
                    value={debouncedValue}
                    onChange={handleInputChange}
                    className="w-full h-full block pl-[18px] pr-[45px] py-4 bg-white border border-[#E7E6EC] text-gray-600 placeholder:text-gray-500 placeholder:text-base outline-hidden rounded-lg search-shadow"
                    placeholder="Search..."
                />
                {debouncedValue && (
                    <button
                        type="button"
                        onClick={() => setDebouncedValue('')}
                        className="absolute top-1/2 -translate-y-1/2 right-[40px] text-gray-500 text-xl font-normal flex items-center"
                    >
                        <RxCross2 />
                    </button>
                )}
                <button
                    type="submit"
                    className="absolute top-1/2 -translate-y-1/2 right-[18px] text-gray-500 text-xl font-normal flex items-center"
                >
                    <IoSearchOutline />
                </button>
            </form>
        </div>
    );
};

export default PosSearch;
