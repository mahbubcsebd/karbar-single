'use client';

import useDictionary from '@/_hooks/useDictionary';
import { getAllCategories } from '@/_utils/categories';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';

export default function MegaMenuNavigation() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedSubMenu, setExpandedSubMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const { language } = useDictionary();
  const currentSubCategory = searchParams.get('sub_category');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoriesData = await getAllCategories(language);
        setCategories(categoriesData.data.slice(0, 12));
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [language]);

  const renderMobileMenuItem = (category) => {
    const isExpanded = expandedSubMenu === category.slug;
    return (
      <li key={category.id} className="relative border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 h-[57px]">
          <Link
            href={`/collections/${category.slug}`}
            className="text-base font-medium text-gray-700"
            onClick={() => setMenuOpen(false)}
          >
            {category.name}
          </Link>
          {category.sub_category?.length > 0 && (
            <button
              onClick={() =>
                setExpandedSubMenu(isExpanded ? null : category.slug)
              }
              className="text-sm text-gray-600"
            >
              {isExpanded ? '▲' : '▼'}
            </button>
          )}
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-[400px] pb-2' : 'max-h-0'
          }`}
        >
          <ul className="pt-2 pl-6">
            {category.sub_category?.map((subCat) => (
              <li key={subCat.id}>
                <Link
                  href={`/collections/${category.slug}?sub_category=${subCat.slug}`}
                  className={`block py-2 text-sm ${
                    currentSubCategory === subCat.slug
                      ? 'font-semibold text-primary'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {subCat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  };

  return (
    <div className="bg-white border-t border-gray-400 categories relative z-40 h-[57px]">
      <div className="container">
        {/* 🔘 Mobile Toggle */}
        <div className="flex items-center justify-between py-4 md:hidden h-[57px]">
          <h3 className="text-lg font-semibold text-gray-800">Categories</h3>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="text-2xl text-gray-700"
          >
            {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
          </button>
        </div>

        {/* ✅ Mobile Dropdown Overlay Menu */}
        <div className="relative md:hidden">
          <div
            className={`absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-md z-[999] transition-all duration-300 ease-in-out ${
              menuOpen
                ? 'opacity-100 translate-y-0 max-h-[400px]'
                : 'opacity-0 -translate-y-4 max-h-0 pointer-events-none'
            } overflow-y-auto max-h-[400px]`}
          >
            <ul>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <li
                      key={i}
                      className="px-4 py-3 h-[57px] flex items-center justify-between border-b border-gray-100 animate-pulse"
                    >
                      <div className="w-1/2 h-4 bg-gray-400 rounded"></div>
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    </li>
                  ))
                : categories.map(renderMobileMenuItem)}
            </ul>
          </div>
        </div>

        {/* ✅ Desktop Menu */}
        <ul className="flex-wrap items-center justify-center hidden gap-6 py-4 md:flex">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <li
                  key={i}
                  className="w-24 h-6 bg-gray-200 rounded animate-pulse"
                ></li>
              ))
            : categories.map((category) => (
                <li
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => setActiveCategory(category.slug)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link
                    href={`/collections/${category.slug}`}
                    className="flex items-center gap-1 text-base font-normal text-gray-600 transition duration-150 hover:text-gray-800"
                    aria-label={`Browse ${category.name}`}
                  >
                    {category.name}
                    {category.sub_category?.length > 0 && (
                      <span className="text-xs">▼</span>
                    )}
                  </Link>

                  {category.sub_category?.length > 0 && (
                    <div
                      className={`absolute left-1/2 transform -translate-x-1/2 max-h-[400px] lg:max-h-[500px] overflow-y-auto top-full mt-2 w-48 bg-white shadow-lg rounded-md z-50 transition-all duration-200 ${
                        activeCategory === category.slug
                          ? 'opacity-100 visible translate-y-0'
                          : 'opacity-0 invisible -translate-y-2'
                      }`}
                    >
                      <ul className="py-1">
                        {category.sub_category.map((subCat) => (
                          <li key={subCat.id}>
                            <Link
                              href={`/collections/${category.slug}?sub_category=${subCat.slug}`}
                              className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                                currentSubCategory === subCat.slug
                                  ? 'font-semibold text-primary'
                                  : 'text-gray-700'
                              }`}
                            >
                              {subCat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
}
