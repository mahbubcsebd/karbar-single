// hooks/useHtmlLangDir.js
import { useEffect } from 'react';

const getDir = (lang) => {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur']; // Add other RTL codes here
    return rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
};

export const useHtmlLangDir = (lang) => {
    useEffect(() => {
        if (typeof document !== 'undefined' && lang) {
            const dir = getDir(lang);
            document.documentElement.setAttribute('lang', lang);
            document.documentElement.setAttribute('dir', dir);
        }
    }, [lang]);
};
