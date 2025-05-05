import { useContext } from 'react';
import { LanguageContext } from '../_context/LanguageContext';

const useDictionary = () => {
    const { language, dictionary, changeLanguage } =
        useContext(LanguageContext);
    return { language, dictionary, changeLanguage };
};

export default useDictionary;
