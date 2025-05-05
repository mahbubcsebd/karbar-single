import { getLanguage } from '@/_utils/getLanguage';
import { createContext, useEffect, useState } from 'react';
import { useHtmlLangDir } from '../_hooks/useHtmlLangDir';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [languages, setLanguages] = useState([]);
    const [language, setLanguage] = useState('en');
    const [dictionary, setDictionary] = useState({});
    const [translations, setTranslations] = useState({}); // Declare translations state
    const [isHydrated, setIsHydrated] = useState(false); // Ensures translations are loaded
    const [isLoading, setIsLoading] = useState(true); // Ensures the app waits for API and translations
    useHtmlLangDir(language);

    const supportedLanguage = ['en', 'bn'];

    const importTranslations = async (availableLanguages) => {
        const importedTranslations = {};

        for (const lang of availableLanguages) {
            try {
                let translation;
                try {
                    translation = await import(
                        `../dictionaries/${lang.code}.json`
                    );
                } catch {
                    console.warn(
                        `Translation file for ${lang.code} not found. Falling back to English.`
                    );
                    translation = await import('../dictionaries/en.json');
                }

                importedTranslations[lang.code] = translation.default;
            } catch {
                console.error(`Failed to load translation for ${lang.code}.`);
                importedTranslations[lang.code] = {};
            }
        }

        return importedTranslations;
    };

    useEffect(() => {
        const fetchLanguagesAndSetup = async () => {
            try {
                const languageData = await getLanguage();
                let fetchedLanguages = [];
                let isFallbackUsed = false;

                if (languageData.data && languageData.data.length > 0) {
                    fetchedLanguages = languageData.data;
                } else {
                    console.warn(
                        "No languages found from API. Using fallback language (English)."
                    );
                    fetchedLanguages = [
                        {
                            id: 1,
                            name: 'English',
                            code: 'en',
                            is_default: true,
                            flag: '/app/assets/icons/english.svg',
                        },
                    ];
                    isFallbackUsed = true;
                    // Store this information for other components if needed
                    localStorage.setItem('usingLanguageFallback', 'true');
                }

                // Always set languages, even if using fallback
                setLanguages(fetchedLanguages);

                // Try to find the default language or fallback to 'en'
                const defaultLanguage =
                    fetchedLanguages.find((lang) => lang.is_default)?.code ||
                    'en';

                const importedTranslations = await importTranslations(
                    fetchedLanguages
                );
                setTranslations(importedTranslations);

                const storedLanguage =
                    localStorage.getItem('language') || defaultLanguage;

                const validLanguage = fetchedLanguages.some(
                    (lang) => lang.code === storedLanguage
                )
                    ? storedLanguage
                    : defaultLanguage;

                setLanguage(validLanguage);
                setDictionary(importedTranslations[validLanguage] || {});
            } catch (error) {
                console.error(
                    'Failed to fetch languages or translations',
                    error
                );
                // In case of error, fall back to English
                setLanguage('en');
                setDictionary({});

                // Set fallback English in case of any error
                setLanguages([
                    {
                        id: 1,
                        name: 'English',
                        code: 'en',
                        is_default: true,
                        flag: '/app/assets/icons/english.svg',
                    },
                ]);
                localStorage.setItem('usingLanguageFallback', 'true');
            } finally {
                setIsHydrated(true);
                setIsLoading(false); // Mark loading complete
            }
        };

        fetchLanguagesAndSetup();
    }, []);

    useEffect(() => {
        if (isHydrated && translations[language]) {
            setDictionary(translations[language]);
            localStorage.setItem('language', language);
        }
    }, [language, isHydrated, translations]);

    const changeLanguage = (lang) => {
        if (translations[lang]) {
            setLanguage(lang);
        } else {
            console.warn(`Language ${lang} is not available.`);
        }
    };

    if (isLoading) {
        // Show a loading spinner or placeholder while the app waits for language setup
        return <div></div>;
    }

    return (
        <LanguageContext.Provider
            value={{
                language,
                dictionary,
                changeLanguage,
                languages,
                isHydrated,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};