import Image from 'next/image';
import LinkButton from './LinkButton';

const LandingChoose = ({ landing, button_text, button_color }) => {
    const { section_two_description, section_two_image } = landing || {};
    if (!section_two_description && !section_two_image) {
        return null
    }
        return (
            <div className="mb-[60px]">
                <div className="container">
                    <div className="grid items-center lg:grid-cols-2 gap-[30px]">
                        {section_two_image && (
                            <div className="w-full lg:h-[600px] overflow-hidden lg:order-last">
                                <Image
                                    src={section_two_image}
                                    alt="landing-1 img"
                                    width={600}
                                    height={600}
                                    className="object-cover object-center w-full h-full"
                                />
                            </div>
                        )}
                        {section_two_description && (
                            <div
                                className=""
                                dangerouslySetInnerHTML={{
                                    __html: section_two_description,
                                }}
                            ></div>
                        )}
                    </div>
                    {(section_two_image || section_two_description) && (
                            <div className="pt-[30px] md:pt-[60px] grid justify-center">
                                <LinkButton
                                    button_text={button_text}
                                    button_color={button_color}
                                />
                            </div>
                        )}
                </div>
            </div>
        );
};

export default LandingChoose;
