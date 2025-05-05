'use client';

import {
    AccordionContent,
    AccordionItem,
    Accordion as AccordionRoot,
    AccordionTrigger,
} from '@/_components/ui/accordion';
import useDictionary from '@/_hooks/useDictionary';
import useFetchData from '@/_hooks/useFetchData';
import getFaq from '@/_utils/getFaq';
import latestbg from '@/assets/images/latest-bg.svg';
import Image from 'next/image';
import { useState } from 'react';
import SectionTitle from '../../../_components/SectionTitle';

const FaqSection = ({ bg }) => {
    const { language, dictionary } = useDictionary();
    const [activeIndex, setActiveIndex] = useState(null);

    const {
        data: faqs,
        loading: faqsLoading,
        error: faqsError,
    } = useFetchData(getFaq, [language]);

    if (faqsLoading) return null;
    if (faqsError) return <p>Error loading FAQs: {faqsError}</p>;
    if (!faqs) return <p>No FAQs found</p>;

    const handleValueChange = (value) => {
        setActiveIndex(value === activeIndex ? null : value);
    };

    // Split faqs array into two columns
    const midPoint = Math.ceil(faqs.length / 2);
    const leftColumnFaqs = faqs.slice(0, midPoint);
    const rightColumnFaqs = faqs.slice(midPoint);

    if(faqs.length === 0) return null;

    return (
        <div className={`${bg ? '' : 'mb-10'} faqs-section pt-5`}>
            <div className={`relative faq-area ${bg ? 'py-16' : ''}`}>
                {bg && (
                    <Image
                        src={latestbg}
                        alt="bg"
                        className="absolute top-0 left-0 z-[-1] w-full h-full object-cover object-center"
                    />
                )}
                <div className="container">
                    <SectionTitle title={dictionary.Faqs.faqTitle} />
                    <div className="w-full max-w-[1170px] mx-auto mt-8">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Left Column */}
                            <div className="space-y-3">
                                <AccordionRoot
                                    type="single"
                                    collapsible
                                    value={activeIndex}
                                    onValueChange={handleValueChange}
                                    className="space-y-3"
                                >
                                    {leftColumnFaqs.map((faq, index) => (
                                        <AccordionItem
                                            key={index}
                                            value={index.toString()}
                                            className="bg-white rounded-[10px] border border-gray-200 px-5 py-5"
                                        >
                                            <AccordionTrigger className="flex items-center justify-between py-1 text-left hover:no-underline">
                                                <span className="text-lg font-semibold leading-snug text-gray-800">
                                                    {faq.question}
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="w-full h-[1px] bg-gray-200 mt-4 mb-3" />
                                                <p className="text-base font-normal text-gray-600">
                                                    {faq.answer}
                                                </p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </AccordionRoot>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-3">
                                <AccordionRoot
                                    type="single"
                                    collapsible
                                    value={activeIndex}
                                    onValueChange={handleValueChange}
                                    className="space-y-3"
                                >
                                    {rightColumnFaqs.map((faq, index) => (
                                        <AccordionItem
                                            key={index + midPoint}
                                            value={(index + midPoint).toString()}
                                            className="bg-white rounded-[10px] border border-gray-200 px-5 py-5"
                                        >
                                            <AccordionTrigger className="flex items-center justify-between py-1 text-left hover:no-underline">
                                                <span className="text-lg font-semibold leading-snug text-gray-800">
                                                    {faq.question}
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="w-full h-[1px] bg-gray-200 mt-4 mb-3" />
                                                <p className="text-base font-normal text-gray-600">
                                                    {faq.answer}
                                                </p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </AccordionRoot>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaqSection;