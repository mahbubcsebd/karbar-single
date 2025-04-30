import Image from 'next/image';
import LinkButton from './LinkButton';

const LandingShopWithUs = ({ landing, button_text, button_color }) => {
    const { section_five_image, section_five_description } = landing || {};

    if (!section_five_description && !section_five_image) {
        return null
    }
        return (
            <div className="shop-with-us-section mb-[60px]">
                <div className="shop-with-us-area">
                    <div className="container">
                        <div className="grid items-center lg:grid-cols-2 gap-[30px]">
                            {section_five_image && (
                                <div className="w-full lg:h-[600px]">
                                    <Image
                                        src={section_five_image}
                                        alt="landing-1"
                                        width={600}
                                        height={600}
                                        className="object-cover object-center w-full h-full"
                                    />
                                </div>
                            )}
                            <div className=" bg-white rounded-lg lg:rounded-[20px] p-[24px] lg:p-10">
                                {section_five_description && (
                                    <div
                                        className="grid gap-[18px]"
                                        dangerouslySetInnerHTML={{
                                            __html: section_five_description,
                                        }}
                                    ></div>
                                )}
                                <div className="pt-[30px] grid justify-start">
                                    <LinkButton
                                        button_text={button_text}
                                        button_color={button_color}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
};

export default LandingShopWithUs