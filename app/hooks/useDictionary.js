import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const useDictionary = () => {
    const { language, dictionary, changeLanguage } =
        useContext(LanguageContext);
    return { language, dictionary, changeLanguage };
};

export default useDictionary;
