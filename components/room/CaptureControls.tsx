import React from 'react';
import Image from 'next/image';
import { LAYOUTS, COLOR_FILTERS, FRAME_BG_PRESETS, BORDER_PRESETS, LayoutKey, RoomState, SessionPhase } from '@/lib/types';
import { Dispatch, SetStateAction } from 'react';

interface CaptureControlsProps {
  roomCode: string;
  roomState: RoomState;
  partnerConnected: boolean;
  phase: SessionPhase | 'error_full';
  activeTab: 'layout' | 'frame' | 'border' | 'text';
  setActiveTab: Dispatch<SetStateAction<'layout' | 'frame' | 'border' | 'text'>>;
  copyDone: boolean;
  copyLink: () => void;
  updateState: (partial: Partial<RoomState>) => void;
  handleReset: (andBroadcast: boolean) => void;
  startSession: () => void;
  setShowResult: (val: boolean) => void;
}

export default function CaptureControls({
  roomCode,
  roomState,
  partnerConnected,
  phase,
  activeTab,
  setActiveTab,
  copyDone,
  copyLink,
  updateState,
  handleReset,
  startSession,
  setShowResult,
}: CaptureControlsProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Image src="/logo.png" alt="Logo" width={36} height={36} className="sidebar-logo" />
        <div>
          <div className="sidebar-title">PhotoBooth Duo</div>
          <div className="sidebar-subtitle">Room aktif</div>
        </div>
        <div className="room-code-badge">
          <span className="room-code-label">Kode</span>
          <span className="room-code-value">{roomCode}</span>
        </div>
      </div>

      <div className="partner-status">
        <div className={`status-dot ${partnerConnected ? 'online' : 'waiting'}`} />
        <span className="partner-status-text">
          {partnerConnected
            ? <><strong>Partner terhubung</strong> ✅</>
            : <><strong>Menunggu partner</strong>...</>
          }
        </span>
      </div>

      <div className="share-row">
        <input
          type="text"
          readOnly
          value={`${typeof window !== 'undefined' ? window.location.origin : ''}/room/${roomCode}`}
          id="share-url"
        />
        <button id="btn-copy-link" className="share-copy-btn" onClick={copyLink}>
          {copyDone ? '✅ Disalin!' : '🔗 Salin'}
        </button>
      </div>

      <div className="sidebar-tabs" role="tablist">
        {[
          { id: 'layout', label: '⊞ Layout' },
          { id: 'frame', label: '🖼 Frame' },
          { id: 'border', label: '✨ Border' },
          { id: 'text', label: '✏️ Teks' },
        ].map(t => (
          <button
            key={t.id}
            id={`sidebar-tab-${t.id}`}
            role="tab"
            aria-selected={activeTab === t.id}
            className={`sidebar-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id as 'layout' | 'frame' | 'border' | 'text')}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="sidebar-body">
        <div className={`panel ${activeTab === 'layout' ? 'active' : ''}`} id="panel-layout">
          <span className="section-label">Layout Hasil</span>
          <div className="opt-grid cols-2">
            {(Object.keys(LAYOUTS) as LayoutKey[]).map(key => (
              <button
                key={key}
                id={`layout-${key}`}
                className={`opt-btn ${roomState.layout === key ? 'active' : ''}`}
                onClick={() => updateState({ layout: key })}
              >
                {key === 'strip3' && '▬▬▬ Strip 3'}
                {key === 'strip4' && '▬▬▬▬ Strip 4'}
                {key === 'grid2x2' && '⊞ Grid 2×2'}
                {key === 'single' && '▭ Single'}
              </button>
            ))}
          </div>

          <span className="section-label" style={{ marginTop: 20 }}>Timer per Foto</span>
          <div className="opt-grid cols-3">
            {[3, 5, 10].map(t => (
              <button
                key={t}
                id={`timer-${t}`}
                className={`opt-btn ${roomState.timer === t ? 'active' : ''}`}
                onClick={() => updateState({ timer: t })}
              >
                {t}s
              </button>
            ))}
          </div>

        </div>

        <div className={`panel ${activeTab === 'frame' ? 'active' : ''}`} id="panel-frame">
          <span className="section-label">Latar Belakang Frame</span>
          <div className="swatch-row">
            {FRAME_BG_PRESETS.map((preset, i) => (
              <button
                key={i}
                id={`frame-bg-${i}`}
                className={`swatch ${roomState.frameBg.val === preset.val && roomState.frameBg.type === preset.type ? 'active' : ''}`}
                style={preset.style}
                onClick={() => updateState({ frameBg: { type: preset.type, val: preset.val } })}
                title={preset.val}
              />
            ))}
            {[
              { type: 'pattern' as const, val: 'polka', style: { background: 'radial-gradient(#ff007f 15%, transparent 16%) 0 0, #fff', backgroundSize: '16px 16px' } },
              { type: 'pattern' as const, val: 'grid', style: { background: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '8px 8px', backgroundColor: '#fff' } },
              { type: 'pattern' as const, val: 'check', style: { background: 'repeating-conic-gradient(#fff 0% 25%, #f1f1f1 0% 50%)', backgroundSize: '16px 16px' } },
            ].map((preset, i) => (
              <button
                key={`p-${i}`}
                id={`frame-pattern-${preset.val}`}
                className={`swatch ${roomState.frameBg.val === preset.val ? 'active' : ''}`}
                style={preset.style as React.CSSProperties}
                onClick={() => updateState({ frameBg: { type: preset.type, val: preset.val } })}
                title={preset.val}
              />
            ))}
          </div>
        </div>

        <div className={`panel ${activeTab === 'border' ? 'active' : ''}`} id="panel-border">
          <span className="section-label">Gaya Bingkai</span>
          <div className="opt-grid cols-2">
            {BORDER_PRESETS.map(b => (
              <button
                key={b.id}
                id={`border-${b.id}`}
                className={`opt-btn ${roomState.photoBorder === b.id ? 'active' : ''}`}
                onClick={() => updateState({ photoBorder: b.id })}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <div className={`panel ${activeTab === 'text' ? 'active' : ''}`} id="panel-text">
          <span className="section-label">Teks di Frame</span>
          <input
            id="custom-text-input"
            type="text"
            className="text-input"
            placeholder="Nama / Event / Tanggal..."
            maxLength={35}
            value={roomState.customText}
            onChange={e => updateState({ customText: e.target.value })}
          />
          <div className="toggle-row">
            <span className="toggle-label">Tampilkan tanggal</span>
            <label className="toggle" htmlFor="toggle-date">
              <input
                id="toggle-date"
                type="checkbox"
                checked={roomState.showDate}
                onChange={e => updateState({ showDate: e.target.checked })}
              />
              <span className="toggle-track" />
            </label>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        {phase === 'done' ? (
          <>
            <button id="btn-footer-result" className="capture-btn" onClick={() => setShowResult(true)}>
              🎉 Lihat &amp; Unduh Hasil
            </button>
            <button id="btn-footer-reset" className="btn-secondary" style={{ width: '100%' }} onClick={() => handleReset(true)}>
              🔄 Ambil Foto Lagi
            </button>
          </>
        ) : (
          <button
            id="btn-footer-start"
            className="capture-btn"
            onClick={startSession}
            disabled={(['countdown', 'capturing', 'error_full'] as string[]).includes(phase) || !partnerConnected}
          >
            {!partnerConnected ? '⏳ Tunggu partner...' : '📸 MULAI SESI FOTO'}
          </button>
        )}
      </div>
    </aside>
  );
}
