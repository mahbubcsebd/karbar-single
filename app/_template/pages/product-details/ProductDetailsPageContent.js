import RelatedProducts from "../../_components/RelatedProducts";
import ProductDetailsContent from "./_components/ProductDetailsPage";

const ProductDetailsPageContent = ({slug}) => {
  return (
      <>
          <ProductDetailsContent slug={slug} />
          <RelatedProducts slug={slug} />
      </>
  );
}

export default ProductDetailsPageContent;