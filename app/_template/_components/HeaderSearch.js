/* eslint-disable react-hooks/exhaustive-deps */
'use client';

// import SearchResult from '@/_components/SearchResult';
import SearchContext from '@/_reducer/SearchContext';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useContext, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import SearchResult from './SearchResult';

const HeaderSearch = ({ showSearchModal, setShowSearchModal, dictionary }) => {
    const [search, setSearch] = useState('');
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const router = useRouter();


    const contextValue = useContext(SearchContext);

    const { setSearchQuery } = contextValue;

    const handleInputChange = (event) => {
        setSearch(event.target.value);
    };
    const handleSearch = (event) => {
        event.preventDefault();
        setSearchQuery(search);
        router.push('/collections/all');
        setSearch('');
    };

    function closeSearchResults() {
        setSearchQuery('');
        setSearch('');
    }

    return (
        <div className="lg:relative">
  <div
    className={`${
      showSearchModal
        ? ''
        : 'hidden lg:inline-block'

    }`}
  >
    <form
      className="header-search relative lg:w-[350px] h-13 lg:h-[50px] w-[250px] sm:w-[370px] md:w-[460px]"
    >
      <input
        type="text"
        name="header-search"
        id="header-search"
        value={search}
        onChange={handleInputChange}
        className="w-full h-full block pl-[45px] pr-[14px] rtl:pr-[45px] rtl:pl-[14px] py-3 bg-white border border-white text-gray-600 placeholder:text-gray-500 placeholder:text-base outline-hidden rounded-full search-shadow"
        placeholder={dictionary.searchPlaceholder}
      />

      {search && (
        <button
          type="button"
          onClick={() => setSearch('')}
          className="absolute top-1/2 -translate-y-1/2 right-0 rtl:left-0 rtl:right-auto text-gray-500 text-xl font-normal flex items-center justify-center min-w-[44px] min-h-[44px] p-2"
          aria-label="Clear search"
        >
          <RxCross2 className="w-5 h-5" />
        </button>
      )}

      <button
        type="submit"
        onClick={handleSearch}
        className="absolute top-1/2 -translate-y-1/2 left-0 rtl:right-0 rtl:left-auto text-gray-500 text-xl font-normal flex items-center justify-center min-w-[44px] min-h-[44px] p-2"
        aria-label="Search products"
      >
        <IoSearchOutline className="w-5 h-5" />
      </button>
    </form>

    {search && search.trim().length > 0 && (
      <SearchResult
        search={search}
        closeSearchResults={closeSearchResults}
      />
    )}
  </div>
</div>

    );
};

export default HeaderSearch;
