'use client';

import { ReactNode, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { CircleHelp, X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface SectionGuideProps {
  title: string;
  steps: string[];
  children?: ReactNode;
  className?: string;
  variant?: 'inline' | 'floating';
  autoOpen?: boolean;
  forceOpen?: boolean;
}

export default function SectionGuide({
  title,
  steps,
  children,
  className = '',
  variant = 'inline',
  autoOpen = false,
  forceOpen = false,
}: SectionGuideProps) {
  const { t, lang, setLang } = useTranslation();
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  useEffect(() => {
    setMounted(true);
    if (autoOpen && !forceOpen) {
      const hasSeenGuide = localStorage.getItem('boothkita_seen_guide');
      if (!hasSeenGuide) {
        setOpen(true);
        localStorage.setItem('boothkita_seen_guide', 'true');
      }
    }
  }, [autoOpen, forceOpen]);

  useEffect(() => {
    const handleOpenEvent = () => setOpen(true);
    window.addEventListener('open-boothkita-guide', handleOpenEvent);
    return () => window.removeEventListener('open-boothkita-guide', handleOpenEvent);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const modal = open ? (
    <div className="guide-overlay" role="presentation" onClick={() => setOpen(false)}>
      <section
        className="guide-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="guide-dialog-head">
          <h2 id={titleId}>{title}</h2>
          <button className="guide-close-btn" onClick={() => setOpen(false)} aria-label={t('guide.close')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        {steps.length > 0 && (
          <ol className="guide-list">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        )}
        {children}
      </section>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        className={`guide-trigger guide-trigger-${variant} ${className}`.trim()}
        onClick={() => setOpen(true)}
        aria-label={title}
        title={title}
      >
        <CircleHelp size={18} />
      </button>
      {mounted && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
