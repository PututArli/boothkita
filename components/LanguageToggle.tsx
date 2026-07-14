'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';

interface LanguageToggleProps {
  style?: React.CSSProperties;
  className?: string;
}

export default function LanguageToggle({ style, className }: LanguageToggleProps) {
  const { lang, setLang } = useTranslation();

  return (
    <div 
      className={className}
      style={{ 
        display: 'flex', 
        gap: 4, 
        background: 'rgba(255,255,255,0.15)', 
        padding: 4, 
        borderRadius: 100, 
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        zIndex: 9999,
        ...style 
      }}
    >
      <button 
        onClick={() => setLang('id')} 
        style={{ 
          padding: '4px 12px', 
          border: 'none', 
          borderRadius: 100, 
          background: lang === 'id' ? 'var(--text)' : 'transparent', 
          color: lang === 'id' ? 'var(--bg)' : 'var(--text)', 
          fontWeight: 700, 
          fontSize: 12, 
          cursor: 'pointer', 
          transition: 'all 0.2s',
          boxShadow: lang === 'id' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
        }}
      >
        ID
      </button>
      <button 
        onClick={() => setLang('en')} 
        style={{ 
          padding: '4px 12px', 
          border: 'none', 
          borderRadius: 100, 
          background: lang === 'en' ? 'var(--text)' : 'transparent', 
          color: lang === 'en' ? 'var(--bg)' : 'var(--text)', 
          fontWeight: 700, 
          fontSize: 12, 
          cursor: 'pointer', 
          transition: 'all 0.2s',
          boxShadow: lang === 'en' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
        }}
      >
        EN
      </button>
    </div>
  );
}
