import { IoSearchOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';

const PosSearch = ({ search, setSearch }) => {
    const handleInputChange = (event) => {
        setSearch(event.target.value);
    };
    const handleSearch = () => {
        setSearch("");
    };
    return (
        <div>
            <form className="relative w-full">
                <input
                    type="text"
                    name="header-search"
                    id="header-search"
                    value={search}
                    onChange={handleInputChange}
                    className="w-full h-full block pl-[18px] pr-[45px] py-4 bg-white border border-[#E7E6EC] text-gray-600 placeholder:text-gray-500 placeholder:text-base outline-hidden rounded-lg search-shadow"
                    placeholder="Search..."
                />
                {search && (
                    <button
                        type="button"
                        onClick={() => setSearch('')}
                        className="absolute top-1/2 -translate-y-1/2 right-[40px] text-gray-500 text-xl font-normal flex items-center"
                    >
                        <RxCross2 />
                    </button>
                )}
                <button
                    // type="submit"
                    // onClick={handleSearch}
                    type="button"
                    className="absolute top-1/2 -translate-y-1/2 right-[18px] text-gray-500 text-xl font-normal flex items-center"
                >
                    <IoSearchOutline />
                </button>
            </form>
        </div>
    );
};

export default PosSearch;
