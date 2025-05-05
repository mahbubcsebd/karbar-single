import Banner from "@/(main)/collections/_components/Banner";
import ProductList from "@/(main)/collections/_components/ProductList";

const CollectionsPageContent = ({ category }) => {
    return (
        <>
            <Banner />
            <ProductList category={category} />
        </>
    );
};

export default CollectionsPageContent