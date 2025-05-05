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
import { useEffect, useState } from 'react';

export default function CategorySelectForm({
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
}) {
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsClient(true);
    // Get sub_category from URL on initial load
    const subCategoryFromUrl = searchParams.get('sub_category');
    if (subCategoryFromUrl && selectedCategory && selectedCategory !== 'all') {
      const category = categories.find((cat) => cat.slug === selectedCategory);
      setSubCategories(category?.sub_category || []);
      setSelectedSubCategory(subCategoryFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      const category = categories.find((cat) => cat.slug === selectedCategory);
      setSubCategories(category?.sub_category || []);

      // Only reset sub-category if there's no sub_category in URL
      const subCategoryFromUrl = searchParams.get('sub_category');
      if (!subCategoryFromUrl) {
        setSelectedSubCategory('all');
      }
    } else {
      setSubCategories([]);
    }
  }, [
    selectedCategory,
    categories,
    setSubCategories,
    setSelectedSubCategory,
    searchParams,
  ]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setSelectedSubCategory('all');
    setSortQuery('all');
    router.push(`/collections/${value}`);
  };

  const handleSubCategoryChange = (value) => {
    setSelectedSubCategory(value);
    setSortQuery('all');
    if (value === 'all') {
      router.push(`/collections/${selectedCategory}`);
    } else {
      router.push(`/collections/${selectedCategory}?sub_category=${value}`);
    }
  };

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedSubCategory('');
    setSortQuery('all');
    setSubCategories([]);
    setBrandQuery('all');
    router.push('/collections/all');
  };

  const handleBreadcrumbCategoryClick = () => {
    setSelectedSubCategory('all');
    setSortQuery('all');
    router.push(`/collections/${selectedCategory}`);
  };

  const showSubCategory =
    selectedCategory &&
    selectedCategory !== 'all' &&
    subCategories &&
    subCategories.length > 0;

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <div>
          <Select
            value={selectedCategory}
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
                  <SelectItem
                    key={category.id}
                    value={category.slug}
                  >
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
              <span
                className="font-light text-gray-500"
                aria-hidden="true"
              >
                |
              </span>
            </div>
            <div>
              <Select
                value={selectedSubCategory}
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
                      <SelectItem
                        key={subCat.id}
                        value={subCat.slug}
                      >
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

      {((selectedCategory && selectedCategory !== 'all') ||
        selectedSubCategory) && (
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
                <ChevronRight
                  className="w-4 h-4"
                  aria-hidden="true"
                />
                <button
                  onClick={handleBreadcrumbCategoryClick}
                  className="hover:text-gray-900"
                  aria-label={`Show all products in ${
                    categories.find((cat) => cat.slug === selectedCategory)
                      ?.name
                  } category`}
                  type="button"
                >
                  {
                    categories.find((cat) => cat.slug === selectedCategory)
                      ?.name
                  }
                </button>
              </>
            )}
            {selectedSubCategory && selectedSubCategory !== 'all' && (
              <>
                <ChevronRight
                  className="w-4 h-4"
                  aria-hidden="true"
                />
                <span className="text-gray-900">
                  {
                    subCategories.find(
                      (sub) => sub.slug === selectedSubCategory
                    )?.name
                  }
                </span>
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
            <X
              className="w-4 h-4 mr-1"
              aria-hidden="true"
            />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
