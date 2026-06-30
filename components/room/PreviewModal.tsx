import { RefObject } from 'react';

interface PreviewModalProps {
  showResult: boolean;
  setShowResult: (val: boolean) => void;
  resultComposed: boolean;
  resultCanvasRef: RefObject<HTMLCanvasElement>;
  handleDownload: () => void;
  handleReset: (val: boolean) => void;
}

export default function PreviewModal({
  showResult,
  setShowResult,
  resultComposed,
  resultCanvasRef,
  handleDownload,
  handleReset,
}: PreviewModalProps) {
  if (!showResult) return null;

  return (
    <div className="modal-backdrop" id="result-modal" onClick={e => { if (e.target === e.currentTarget) setShowResult(false); }}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">🎉 Hasil Foto Berdua!</h2>
          <button
            id="btn-close-result"
            className="modal-close"
            onClick={() => setShowResult(false)}
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        <div className="result-canvas-wrap">
          <canvas ref={resultCanvasRef} style={{ maxWidth: '100%' }} />
        </div>

        {!resultComposed && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 16, fontSize: 13 }}>
            <span className="spinner" style={{ display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }} />
            Sedang menyusun foto...
          </p>
        )}

        <div className="modal-actions">
          <button
            id="btn-modal-reset"
            className="btn-outline"
            onClick={() => { setShowResult(false); handleReset(true); }}
          >
            🔄 Ambil Lagi
          </button>
          <button
            id="btn-modal-download"
            className="btn-filled"
            onClick={handleDownload}
            disabled={!resultComposed}
          >
            💾 Unduh Foto
          </button>
        </div>
      </div>
    </div>
  );
}
