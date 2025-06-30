import Advertisement from '@/_components/Advertisement';
import Testimonials from '../../_components/Testimonials';
// import Advertisement from './_components/Advertisement';
import AllProducts from './_components/AllProducts';
import FaqSection from './_components/FaqSection';
import HeroSlider from './_components/HeroSlider';
import LatestProduct from './_components/LatestProduct';
import MegaMenuNavigation from './_components/MegaMenuNavigation';
import RecentlyViewed from './_components/RecentlyViewed';

const HomePageContent = () => {
  return (
    <>
      <MegaMenuNavigation />
      <HeroSlider />
      <Advertisement position="home_top" />
      <LatestProduct />
      <AllProducts />
      <Advertisement position="home_middle" />
      <FaqSection bg={true} />
      <Testimonials bg={true} />
      <RecentlyViewed />
      <Advertisement position="home_bottom" />
    </>
  );
};

export default HomePageContent;
