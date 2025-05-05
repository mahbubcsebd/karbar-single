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
    product_name_with_attr,
    unit_price,
    sale_price,
    preview_image,
    barcode_or_sku_code,
    quantity,
  } = product;

  const { state, dispatch } = usePos();

  const selectedProduct = { ...product, stock:quantity, quantity: 1 };

  const handleAddToCart = () => {
    const productInCart = state.posCartItems.find(
      (item) => item.barcode_or_sku_code === barcode_or_sku_code
    );

    if (productInCart) {
      dispatch({
        type: 'INCREMENT_QUANTITY',
        payload: barcode_or_sku_code,
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
      alt={product_name_with_attr}
      width={270}
      height={320}
      className="object-cover w-full h-full"
    />
  );

const renderStockBadge = () => {
  const isOnlyTitle = pos_theme_style === 'only_title';
  const badgeClass = isOnlyTitle
    ? 'border border-gray-400 bg-transparent text-gray-800'
    : quantity > 0
    ? 'bg-[#28A745] text-white'
    : 'bg-[#F44336] text-white';

  return (
    <div
      className={`absolute top-1 right-1 p-[6px] rounded-full text-[9px] ${badgeClass}`}
    >
      <p>{quantity > 0 ? `${quantity} In Stock` : 'Out of stock'}</p>
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
      {`${siteSetting.currency_icon || '৳'}${sale_price === 0 ? unit_price : sale_price}`}
    </div>
  );
};


  return (
    <div className="h-full overflow-hidden bg-white rounded-lg product-card">
      <button
        onClick={handleAddToCart}
        disabled={quantity <= 0}
        className={`block w-full relative cursor-pointer ${
          pos_theme_style === 'only_title'
            ? 'h-[122px] bg-white flex items-center justify-center rounded-t-md border-b border-gray-200'
            : 'h-[122px] overflow-hidden rounded-t-md'
        }`}
      >
        {pos_theme_style === 'only_title' ? (
          <>
            <div className="px-2 text-sm font-semibold text-center text-gray-700 capitalize">
              {product_name_with_attr}
            </div>
            {renderStockBadge()}
            {renderPriceBadge()}
          </>
        ) : (
          <>
            {renderImage()}
            {renderStockBadge()}
            {renderPriceBadge()}
          </>
        )}
      </button>

      {pos_theme_style === 'image_with_title' && (
        <div className="p-[6px] bg-white">
          <button
            onClick={handleAddToCart}
            disabled={quantity <= 0}
            className="block w-full mb-1 text-sm font-medium text-left text-gray-900 capitalize ellipsis-2"
          >
            {product_name_with_attr}
          </button>
          <p className="text-[10px] font-semibold text-gray-900">
            {`${siteSetting.currency_icon || '৳'}${
              sale_price === 0 ? unit_price : sale_price
            }`}
          </p>
        </div>
      )}
    </div>
  );
};

export default PosProductCard;
