import SortContext from "@/_context/SortContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { IoIosArrowForward } from "react-icons/io";
import ShortProduct from "./ShortProduct";

const SingleShorts = ({ title, sort, products }) => {
  const { setSortQuery } = useContext(SortContext);
  const router = useRouter();

  const handleCategoryClick = (sorting) => {
    setSortQuery(sorting);
    router.push('/collections/all');
  };
  return (
    <div className="single-short px-4 py-[30px] border border-gray-500 rounded-[20px]">
      <div className="flex justify-between items-center border-b border-[#A2DFA8] pb-4">
        <h3 className="text-[20px] font-semibold text-gray-800">{title}</h3>
        <button
          onClick={() => handleCategoryClick(sort)}
          type="button"
          area-label="View All"
          className="flex items-center gap-2 text-sm text-[#17AF26] font-semibold"
        >
          View All <IoIosArrowForward />
        </button>
      </div>
      <ul className="pt-6 grid gap-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex items-center gap-4"
          >
            <ShortProduct product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SingleShorts