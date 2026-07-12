'use client';

import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react';
import { CapturedPhoto } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import SectionGuide from '@/components/SectionGuide';

interface CaptureReviewPageProps {
  myPhotos: CapturedPhoto[];
  partnerPhotos: CapturedPhoto[];
  totalCount: number;
  onRetake: (index: number) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function CaptureReviewPage({
  myPhotos,
  partnerPhotos,
  totalCount,
  onRetake,
  onContinue,
  onBack,
}: CaptureReviewPageProps) {
  const { t } = useTranslation();
  const slots = Array.from({ length: totalCount });
  const isComplete = slots.every((_, index) => myPhotos[index]?.dataUrl && partnerPhotos[index]?.dataUrl);

  return (
    <div className="capture-review-page">
      <header className="capture-review-header">
        <button className="capture-review-ghost-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          {t('review.backCamera')}
        </button>
        <div className="capture-review-title">
          <div>
            <p className="capture-review-eyebrow">{t('review.title')}</p>
            <h1>{t('review.subtitle')}</h1>
          </div>
          <SectionGuide
            title={t('guide.review.title')}
            steps={[
              t('guide.review.step1'),
              t('guide.review.step2'),
              t('guide.review.step3'),
              t('guide.review.step4'),
            ]}
          />
        </div>
        <button className="capture-review-primary-btn" onClick={onContinue} disabled={!isComplete}>
          {t('review.continue')}
          <ArrowRight size={16} />
        </button>
      </header>

      <main className="capture-review-grid">
        {slots.map((_, index) => {
          const mine = myPhotos[index]?.dataUrl;
          const partner = partnerPhotos[index]?.dataUrl;
          const ready = Boolean(mine && partner);

          return (
            <article className="capture-review-card" key={index}>
              <div className="capture-review-card-top">
                <span>#{index + 1}</span>
                <span className={ready ? 'capture-review-status ready' : 'capture-review-status'}>
                  {ready ? <Check size={13} /> : null}
                  {ready ? t('review.ready') : t('review.missing')}
                </span>
              </div>

              <div className="capture-review-pair">
                <figure>
                  {mine ? <img src={mine} alt={`${t('review.myPhoto')} ${index + 1}`} /> : <div />}
                  <figcaption>{t('review.myPhoto')}</figcaption>
                </figure>
                <figure>
                  {partner ? <img src={partner} alt={`${t('review.partnerPhoto')} ${index + 1}`} /> : <div />}
                  <figcaption>{t('review.partnerPhoto')}</figcaption>
                </figure>
              </div>

              <button className="capture-review-retake" onClick={() => onRetake(index)}>
                <RotateCcw size={15} />
                {t('review.retake')}
              </button>
            </article>
          );
        })}
      </main>
    </div>
  );
}
