'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';

export const LanguageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return <>{children}</>;
};