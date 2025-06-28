import { useAppSelector } from '@/hooks/reduxHooks';
import { selectUser } from '@/redux/features/userSlice';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const user = useAppSelector(selectUser);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Маппинг кодов языков из базы на коды i18n
  const languageMap: { [key: string]: string } = {
    // Поддержка полных названий (для обратной совместимости)
    'english': 'en',
    'spanish': 'es', 
    'russian': 'ru',
    'french': 'fr',
    'german': 'de',
    'italian': 'it',
    'portuguese': 'pt',
    'chinese': 'zh',
    'japanese': 'ja',
    'korean': 'ko',
    'arabic': 'ar',
    'hindi': 'hi',
    // Поддержка коротких кодов (прямой маппинг)
    'en': 'en',
    'es': 'es',
    'ru': 'ru',
    'fr': 'fr',
    'de': 'de',
    'it': 'it',
    'pt': 'pt',
    'zh': 'zh',
    'ja': 'ja',
    'ko': 'ko',
    'ar': 'ar',
    'hi': 'hi',
  };

  useEffect(() => {
    if (user?.language) {
      const i18nLanguage = languageMap[user.language] || user.language || 'en';
      console.log('Setting language from profile:', user.language, '→', i18nLanguage);
      changeLanguage(i18nLanguage);
    }
  }, [user?.language]);

  const changeLanguage = async (language: string) => {
    await i18n.changeLanguage(language);
    setCurrentLanguage(language);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};