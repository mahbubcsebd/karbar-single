import ProductDetailsContent from "@/(main)/products/_components/ProductDetailsContent";
import RelatedProducts from "../../_components/RelatedProducts";
// import RelatedProducts from "@/template/_components/RelatedProducts";

const ProductDetailsPageContent = ({slug}) => {
  return (
      <>
          <ProductDetailsContent slug={slug} />
          <RelatedProducts slug={slug} />
      </>
  );
}

export default ProductDetailsPageContent;