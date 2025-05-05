import { FaRegHeart } from "react-icons/fa6";

const HeaderWishlist = () => {
  return (
    <button type="button" className='w-10 h-10 md:w-[50px] text-base md:h-[50px] flex items-center justify-center rounded-full bg-white border border-white lg:text-xl font-bold text-gray-900'>
        <FaRegHeart />
    </button>
  )
}

export default HeaderWishlist