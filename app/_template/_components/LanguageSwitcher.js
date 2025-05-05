'use client';

import { LanguageContext } from '@/_context/LanguageContext';
import { getLanguage } from '@/_utils/getLanguage';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { MdCheck, MdKeyboardArrowDown } from 'react-icons/md'; // Import MdCheck for the tick mark

const LanguageSwitcher = ({ template }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { language, changeLanguage } = useContext(LanguageContext);
    const [languages, setLanguages] = useState([]);

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null); // Ref for the dropdown container

    // Fetch languages dynamically
    useEffect(() => {
        const fetchLanguage = async () => {
            const languageData = await getLanguage();
            setLanguages(languageData.data);
        };

        fetchLanguage();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLanguageChange = (langCode) => {
        changeLanguage(langCode);
        setIsOpen(false);
    };

    // Find the selected language
    const selectedLanguage = languages.find((lang) => lang.code === language);

    return (
        <div className="flex items-center gap-4">
            <div
                className="relative"
                ref={dropdownRef}
            >
                {/* Selected Language Display */}
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                    <span className="hidden w-6 h-6 md:inline-block">
                        {selectedLanguage && (
                            <Image
                                src={selectedLanguage.flag}
                                alt={selectedLanguage.name}
                                className="w-full h-full"
                                width={24}
                                height={24}
                            />
                        )}
                    </span>
                </div>
                <div
                    className={`block w-full md:py-[10px] md:h-12 md:rounded-full font-normal md:border border-white appearance-none md:px-9 focus:outline-hidden focus:ring-2 focus:ring-purple-400 cursor-pointer capitalize md:bg-white pr-4 ${
                        template === 'Template02'
                            ? 'text-white md:text-gray-800'
                            : 'text-gray-800'
                    }`}
                    onClick={toggleDropdown}
                >
                    {selectedLanguage ? selectedLanguage.code : ''}
                    <div className="absolute inset-y-0 right-0 flex items-center text-gray-500 pointer-events-none md:pr-2">
                        <MdKeyboardArrowDown />
                    </div>
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-9999 w-full mt-1 bg-white rounded-md shadow-lg min-w-[150px] right-0">
                        <ul className="py-1 text-gray-700">
                            {languages.map((lang) => (
                                <li
                                    key={lang.code}
                                    className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() =>
                                        handleLanguageChange(lang.code)
                                    }
                                >
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 mr-2 rounded-full">
                                            <Image
                                                src={lang.flag}
                                                alt={lang.name}
                                                className="object-cover w-full h-full"
                                                width={24}
                                                height={24}
                                            />
                                        </div>
                                        {lang.name}
                                    </div>
                                    {/* Show tick mark for the selected language */}
                                    {language === lang.code && (
                                        <MdCheck className="text-purple-600" />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LanguageSwitcher;
