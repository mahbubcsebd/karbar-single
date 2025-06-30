'use client';

import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import noAvailableImg from '@/assets/icons/no-available.svg';
import Image from 'next/image';
import usePos from '../../_hooks/usePos';

const PosProductCard = ({ product }) => {
  const { dictionary } = useDictionary();
  const { priceCurrency } = dictionary.ProductCard;
  const { siteSetting } = useSiteSetting();

  const pos_theme_style = siteSetting?.pos_theme_style || 'image_with_title';

  const {
    product_name,
    unit_price,
    final_sale_price,
    preview_image,
    product_id,
    variant_sku,
    quantity,
    available_stock,
  } = product;

  const { state, dispatch } = usePos();

  const selectedProduct = {
    ...product,
    stock: available_stock,
    quantity: 1,
  };

  const handleAddToCart = () => {
    const productInCart = state.posCartItems.find(
      (item) =>
        item.product_id === product_id && item.variant_sku === variant_sku
    );

    if (productInCart) {
      dispatch({
        type: 'INCREMENT_QUANTITY',
        payload: { product_id, variant_sku },
      });
    } else {
      dispatch({
        type: 'ADD_TO_CART',
        payload: selectedProduct,
      });
    }
  };

  const renderImage = () => (
    <Image
      src={preview_image || noAvailableImg}
      alt={product_name}
      width={270}
      height={320}
      className="object-contain w-full h-full"
    />
  );

  const renderStockBadge = () => {
    const isOnlyTitle = pos_theme_style === 'only_title';
    const badgeClass = isOnlyTitle
      ? 'border border-gray-400 bg-transparent text-gray-800'
      : available_stock > 0
      ? 'bg-[#28A745] text-white'
      : 'bg-[#F44336] text-white';

    return (
      <div
        className={`absolute top-1 right-1 p-[6px] rounded-full text-[9px] ${badgeClass}`}
      >
        <p>
          {available_stock > 0 ? `${available_stock} In Stock` : 'Out of stock'}
        </p>
      </div>
    );
  };

  const renderPriceBadge = () => {
    const isOnlyTitle = pos_theme_style === 'only_title';
    const isOnlyImage = pos_theme_style === 'only_image';

    if (!isOnlyTitle && !isOnlyImage) return null;

    const badgeClass = isOnlyTitle
      ? 'border border-gray-400 bg-transparent text-gray-800'
      : 'bg-black text-white';

    return (
      <div
        className={`absolute top-1 left-1 p-[6px] rounded-full text-[9px] font-semibold ${badgeClass}`}
      >
        {`${siteSetting.currency_icon || '৳'}${
          final_sale_price === 0 ? unit_price : final_sale_price
        }`}
      </div>
    );
  };

  return (
    <div className="h-full overflow-hidden bg-white rounded-lg product-card">
      <button
        onClick={handleAddToCart}
        disabled={available_stock <= 0}
        className={`block w-full relative cursor-pointer ${
          pos_theme_style === 'only_title'
            ? 'h-[130px] bg-white flex items-center justify-center rounded-t-md border-b border-gray-200'
            : 'h-[130px] overflow-hidden rounded-t-md'
        }`}
      >
        {pos_theme_style === 'only_title' ? (
          <>
            <div className="px-2 text-sm font-semibold text-center text-gray-700 capitalize">
              {product_name}
            </div>
            {renderStockBadge()}
            {renderPriceBadge()}
          </>
        ) : (
          <>
            {renderImage()}
            {pos_theme_style === 'only_image' && renderStockBadge()}
            {renderPriceBadge()}
          </>
        )}
      </button>

      {pos_theme_style === 'image_with_title' && (
        <div className="p-[6px] bg-white">
          <div className="border-b border-gray-300 pb-1 mb-1">
            <button
              onClick={handleAddToCart}
              disabled={available_stock <= 0}
              className="block w-full text-base font-medium text-left text-gray-900 capitalize ellipsis-2 min-h-12"
              title={product_name}
              aria-label={`Add ${product_name} to cart`}
            >
              {product_name}
            </button>
          </div>
          <div className="flex justify-between items-center gap-2">
            <p className="text-lg font-medium text-gray-900 flex items-start gap-1">
              <span className="text-sm text-[#28A745] mt-[4px] font-bold">
                {siteSetting.currency_icon || '৳'}
              </span>
              {`${final_sale_price === 0 ? unit_price : final_sale_price}`}
            </p>
            <p
              className={`text-sm ${
                available_stock > 0 ? 'text-gray-700' : 'text-[#F44336]'
              }`}
            >
              {available_stock > 0
                ? `${available_stock} In Stock`
                : 'Out of stock'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosProductCard;
