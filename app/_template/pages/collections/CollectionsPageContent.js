import Banner from "./_components/Banner";
import ProductList from "./_components/ProductList";

const CollectionsPageContent = ({ category }) => {
    return (
        <>
            <Banner />
            <ProductList category={category} />
        </>
    );
};

export default CollectionsPageContent