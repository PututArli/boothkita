import { CapturedPhoto } from '@/lib/types';

interface PreviewModalProps {
  showResult: boolean;
  setShowResult: (val: boolean) => void;
  resultComposed: boolean;
  resultImgUrl: string;
  handleDownload: () => void;
  handleReset: (val: boolean) => void;
  myPhotos?: CapturedPhoto[];
  partnerPhotos?: CapturedPhoto[];
}

export default function PreviewModal({
  showResult,
  resultComposed,
  resultImgUrl,
  handleDownload,
  handleReset,
}: PreviewModalProps) {
  if (!showResult) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px', overflowY: 'auto' }}>
      <div className="landing-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      
      <div style={{ width: '100%', maxWidth: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 32, textAlign: 'center' }}>
          ALL DONE ♡
        </h2>

        {resultComposed && resultImgUrl ? (
          <img src={resultImgUrl} alt="Final Photobooth Strip" style={{ maxWidth: '100%', maxHeight: '65vh', boxShadow: 'var(--shadow-lg)', borderRadius: 4, objectFit: 'contain' }} />
        ) : (
          <div style={{ width: 280, height: 500, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', backdropFilter: 'blur(10px)', borderRadius: 12 }}>
            Processing...
          </div>
        )}

        <div style={{ display: 'flex', gap: 16, marginTop: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            onClick={handleDownload}
            disabled={!resultComposed}
            style={{ padding: '14px 24px', borderRadius: 100, fontSize: 15, fontWeight: 700, cursor: resultComposed ? 'pointer' : 'not-allowed', opacity: resultComposed ? 1 : 0.7, display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'var(--text)', color: 'var(--bg)', transition: 'all 0.2s', boxShadow: resultComposed ? 'var(--accent-glow)' : 'none' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download PNG
          </button>
          
          <button 
            onClick={() => handleReset(true)}
            style={{ padding: '14px 24px', borderRadius: 100, fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text)', backdropFilter: 'blur(10px)', transition: 'all 0.2s' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
            Retake
          </button>
        </div>
        
        <p style={{ marginTop: 24, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
          Your photo has been successfully generated!
        </p>

      </div>
    </div>
  );
}
