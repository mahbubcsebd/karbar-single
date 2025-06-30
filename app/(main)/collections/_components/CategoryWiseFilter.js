'use client';

import { Button } from '@/_components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/_components/ui/select';
import { ChevronRight, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function CategoryWiseFilter({
  categories,
  subCategories,
  setSubCategories,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  setSortQuery,
  setBrandQuery,
  router,
  onCategoryChange,
  onAllFilter,
}) {
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const isInitializing = useRef(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize subcategories based on selected category - only run once
  useEffect(() => {
    if (!isClient || !categories.length) return;

    if (selectedCategory && selectedCategory !== 'all') {
      const category = categories.find((cat) => cat.slug === selectedCategory);
      const newSubCategories = category?.sub_category || [];
      setSubCategories(newSubCategories);

      // Only set subcategory from URL on initial load
      if (isInitializing.current) {
        const subCategoryFromUrl = searchParams.get('sub_category');
        if (
          subCategoryFromUrl &&
          newSubCategories.some((sub) => sub.slug === subCategoryFromUrl)
        ) {
          setSelectedSubCategory(subCategoryFromUrl);
        } else {
          setSelectedSubCategory('all');
        }
        isInitializing.current = false;
      }
    } else {
      setSubCategories([]);
      if (isInitializing.current) {
        isInitializing.current = false;
      }
    }
  }, [
    selectedCategory,
    categories,
    setSubCategories,
    setSelectedSubCategory,
    searchParams,
    isClient,
  ]);

  // Optimized category change handler
  const handleCategoryChange = useCallback(
    (value) => {
      if (value === 'all') {
        onAllFilter();
      } else {
        onCategoryChange(value);
      }
    },
    [onCategoryChange, onAllFilter]
  );

  // Optimized subcategory change handler
  const handleSubCategoryChange = useCallback(
    (value) => {
      setSelectedSubCategory(value);
      setSortQuery('all');

      if (value === 'all') {
        router.push(`/collections/${selectedCategory}`);
      } else {
        router.push(`/collections/${selectedCategory}?sub_category=${value}`);
      }
    },
    [setSelectedSubCategory, setSortQuery, router, selectedCategory]
  );

  // Optimized reset handler
  const handleReset = useCallback(() => {
    setSelectedCategory('all');
    setSelectedSubCategory('all');
    setSortQuery('all');
    setSubCategories([]);
    setBrandQuery('all');
    router.push('/collections/all');
  }, [
    setSelectedCategory,
    setSelectedSubCategory,
    setSortQuery,
    setSubCategories,
    setBrandQuery,
    router,
  ]);

  // Optimized breadcrumb category click
  const handleBreadcrumbCategoryClick = useCallback(() => {
    setSelectedSubCategory('all');
    setSortQuery('all');
    router.push(`/collections/${selectedCategory}`);
  }, [setSelectedSubCategory, setSortQuery, router, selectedCategory]);

  // Memoize computed values
  const showSubCategory = useMemo(() => {
    return (
      selectedCategory &&
      selectedCategory !== 'all' &&
      subCategories &&
      subCategories.length > 0
    );
  }, [selectedCategory, subCategories]);

  const showFilters = useMemo(() => {
    return (
      (selectedCategory && selectedCategory !== 'all') ||
      (selectedSubCategory && selectedSubCategory !== 'all')
    );
  }, [selectedCategory, selectedSubCategory]);

  const currentCategoryName = useMemo(() => {
    return categories.find((cat) => cat.slug === selectedCategory)?.name;
  }, [categories, selectedCategory]);

  const currentSubCategoryName = useMemo(() => {
    return subCategories.find((sub) => sub.slug === selectedSubCategory)?.name;
  }, [subCategories, selectedSubCategory]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <div>
          <Select
            value={selectedCategory || 'all'}
            onValueChange={handleCategoryChange}
            className="relative z-9999999"
            aria-label="Select category"
          >
            <SelectTrigger
              className={`w-[150px] md:w-[200px] bg-white text-xs lg:text-sm text-gray-900 font-normal justify-between px-3 py-2 border-gray-300 focus:ring-0 shadow-none ${
                showSubCategory
                  ? 'rounded-none rounded-l-md border-r-0'
                  : 'rounded-md'
              }`}
              role="combobox"
              aria-label="Category selector"
              aria-expanded="false"
              aria-controls="category-select"
            >
              <SelectValue
                placeholder={
                  selectedCategory === 'all' ? 'All Categories' : 'Category'
                }
              />
            </SelectTrigger>
            <SelectContent
              className="z-9999999 max-h-[250px] lg:max-h-[300px]"
              id="category-select"
            >
              <SelectGroup>
                <SelectLabel>Categories</SelectLabel>
                <SelectItem value="all">All</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {showSubCategory && (
          <>
            <div className="flex items-center justify-center h-full bg-white border-t border-b border-gray-300">
              <span className="font-light text-gray-500" aria-hidden="true">
                |
              </span>
            </div>
            <div>
              <Select
                value={selectedSubCategory || 'all'}
                onValueChange={handleSubCategoryChange}
                className="relative z-9999999"
                aria-label="Select subcategory"
              >
                <SelectTrigger
                  className="w-[150px] md:w-[200px] bg-white text-xs lg:text-sm text-gray-900 font-normal justify-between px-3 py-2 border-gray-300 rounded-none rounded-r-md border-l-0 shadow-none focus:ring-0"
                  role="combobox"
                  aria-label="Subcategory selector"
                  aria-expanded="false"
                  aria-controls="subcategory-select"
                >
                  <SelectValue placeholder="All Sub Categories" />
                </SelectTrigger>
                <SelectContent
                  className="z-9999999 max-h-[250px] lg:max-h-[300px]"
                  id="subcategory-select"
                >
                  <SelectGroup>
                    <SelectLabel>Sub Categories</SelectLabel>
                    <SelectItem value="all">All</SelectItem>
                    {subCategories.map((subCat) => (
                      <SelectItem key={subCat.id} value={subCat.slug}>
                        {subCat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>

      {showFilters && (
        <div className="flex items-center gap-4">
          <nav
            className="flex items-center space-x-1 text-xs text-gray-600 md:text-sm"
            aria-label="Category navigation"
          >
            <button
              onClick={() => router.push('/collections/all')}
              className="hover:text-gray-900"
              aria-label="Show all collections"
              type="button"
            >
              Collections
            </button>
            {selectedCategory && selectedCategory !== 'all' && (
              <>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
                <button
                  onClick={handleBreadcrumbCategoryClick}
                  className="hover:text-gray-900"
                  aria-label={`Show all products in ${currentCategoryName} category`}
                  type="button"
                >
                  {currentCategoryName}
                </button>
              </>
            )}
            {selectedSubCategory && selectedSubCategory !== 'all' && (
              <>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
                <span className="text-gray-900">{currentSubCategoryName}</span>
              </>
            )}
          </nav>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8"
            aria-label="Clear all filters"
            type="button"
          >
            <X className="w-4 h-4 mr-1" aria-hidden="true" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
