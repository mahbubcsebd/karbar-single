// import landingBg from "@/assets/images/landing-banner-bg.svg";
import Testimonials from '@/_components/Testimonials';
import { getLanding } from '@/_utils/getLanding';
import { getPaymentMethod } from '@/_utils/getPaymentMethod';
import { getSiteSettings } from '@/_utils/getSiteSettings';
import { getTestimonials } from '@/_utils/getTestimonial';
import LandingBanner from './_component/LandingBanner';
import LandingCheckoutPage from './_component/LandingCheckoutPage';
import LandingChoose from './_component/LandingChoose';
import LandingDescription from './_component/LandingDescription';
import LandingShopWithUs from './_component/LandingShopWithUs';
import OurPackages from './_component/OurPackages';

export async function generateMetadata({ params }) {
    const slug = (await params)?.slug || 'default-slug'; // Fallback if slug is undefined

    // Function to capitalize each word
    function capitalizeEachWord(text) {
        return text
            .split(' ')
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' ');
    }

    // Replace hyphens with spaces in slug and capitalize the words
    const slugTitle = slug.replace(/-/g, ' ');

    // Fetch site settings with a fallback to ensure it doesn't break if fetching fails
    const siteSetting = (await getSiteSettings('en')) || {};
    const data = siteSetting?.data || {};

    // Set fallback values for properties if they are missing
    const title = data.title || 'Default Site Title';
    const fevIcon = data.fev_icon || '/default-icon.png';
    const headerLogo = data.header_logo || '/default-logo.png';
    const footerDescription = data.footer_description || 'Default description';
    const website = data.website || 'https://example.com';

    return {
        title: `${title} | ${capitalizeEachWord(slugTitle)}`,
        icons: {
            icon: fevIcon,
            apple: fevIcon,
        },
        openGraph: {
            title,
            description: footerDescription,
            url: website,
            type: 'website',
            images: [
                {
                    url: headerLogo,
                    width: 1200,
                    height: 630,
                    alt: `${title} Logo`,
                },
            ],
        },
    };
}


const LandingPage = async ({ params }) => {
     const slug = (await params).slug;
    const siteSettings = await getSiteSettings('en');
    const paymentMethod = await getPaymentMethod('en');
    const testimonials = await getTestimonials('en');
    const landingData = await getLanding(slug);

    const {
        section_one_title,
        section_one_image,
        section_two_description,
        section_two_image,
        section_three_video,
        section_three_key_feature,
        section_three_offer_order,
        section_four_available_size,
        section_five_image,
        section_five_description,
        products,
        button_text,
        button_color,
        package_title,
        is_combo_product,
        is_multiple_quantity_allow,
        combo,
        is_coupon_field_visible,
    } = landingData.data;

    return (
        <div className="landing-page ">
            <LandingBanner landing={{ section_one_title, section_one_image }} />
            <LandingChoose
                landing={{ section_two_description, section_two_image }}
                button_text={button_text}
                button_color={button_color}
            />
            <LandingDescription
                landing={{
                    section_three_video,
                    section_three_key_feature,
                    section_three_offer_order,
                    section_four_available_size,
                }}
                button_text={button_text}
                button_color={button_color}
            />
            {testimonials.data.length >= 3 && (
                <div className="landing-testimonial bg-[#F4EBFF] pt-10 pb-3 lg:pt-20 lg:pb-14 mb-[30px] lg:mb-[60px]">
                    <Testimonials />
                </div>
            )}
            <LandingShopWithUs
                landing={{ section_five_image, section_five_description }}
                button_text={button_text}
                button_color={button_color}
            />
            {products.length > 0 && (
                <OurPackages
                package_title={package_title}
                products={products}
                />
            )}
            <LandingCheckoutPage
                siteSettings={siteSettings.data}
                paymentMethod={paymentMethod.data}
                is_multiple_quantity_allow={is_multiple_quantity_allow}
                is_combo_product={is_combo_product}
                combo={combo}
                is_coupon_field_visible={is_coupon_field_visible}
            />
        </div>
    );
};

export default LandingPage;
