import React, { useState } from 'react';
import { CapturedPhoto, LayoutKey, LAYOUTS } from '@/lib/types';

interface ArrangePageProps {
  myPhotos: CapturedPhoto[];
  layoutKey: string;
  onSubmit: (selectedIndices: number[]) => void;
}

export function ArrangePage({ myPhotos, layoutKey, onSubmit }: ArrangePageProps) {
  const layout = LAYOUTS[layoutKey as LayoutKey] || LAYOUTS.strip3;
  const count = layout.count;
  const [selectedIndices, setSelectedIndices] = useState<(number | null)[]>(Array(count).fill(null));
  const [activeSlot, setActiveSlot] = useState<number>(0);

  const handleSelectPhoto = (photoIndex: number) => {
    setSelectedIndices(prev => {
      const next = [...prev];
      next[activeSlot] = photoIndex;
      return next;
    });
    
    // Auto-advance to next empty slot
    const nextEmpty = selectedIndices.findIndex((val, i) => i !== activeSlot && (i > activeSlot ? val === null : false));
    if (nextEmpty !== -1) {
      setActiveSlot(nextEmpty);
    } else {
      const firstEmpty = selectedIndices.indexOf(null);
      if (firstEmpty !== -1 && firstEmpty !== activeSlot) {
        setActiveSlot(firstEmpty);
      } else {
        // Find next empty wrapping around
        const next = selectedIndices.findIndex((val, i) => val === null && i !== activeSlot);
        if (next !== -1) setActiveSlot(next);
      }
    }
  };

  const handleSlotClick = (slotIndex: number) => {
    setActiveSlot(slotIndex);
  };

  const isComplete = selectedIndices.every(val => val !== null);

  const handleSubmit = () => {
    if (isComplete) {
      onSubmit(selectedIndices as number[]);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto',
      padding: '40px 20px',
    }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 40 }}>
        MAKE YOUR STRIP
      </h2>

      <div style={{
        display: 'flex', gap: 40, width: '100%', maxWidth: 900,
        flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'
      }}>
        {/* Left: Pool of captured photos */}
        <div style={{ flex: '1 1 300px', maxWidth: 400 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12
          }}>
            {myPhotos.map((p, i) => {
              const isUsed = selectedIndices.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => handleSelectPhoto(i)}
                  style={{
                    padding: 0, border: 'none', background: 'none', cursor: 'pointer',
                    borderRadius: 8, overflow: 'hidden', position: 'relative',
                    aspectRatio: '4/3', borderStyle: 'solid', borderWidth: 2,
                    borderColor: isUsed ? 'var(--accent)' : 'transparent',
                    opacity: isUsed ? 0.6 : 1, transition: 'all 0.2s',
                  }}
                >
                  {p?.dataUrl ? (
                    <img src={p.dataUrl} alt={`Take ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.1)' }} />
                  )}
                  {isUsed && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,107,152,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 32, height: 32, background: 'var(--accent)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Layout slots */}
        <div style={{ flex: '1 1 300px', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 16,
            display: 'grid', gridTemplateColumns: `repeat(${layout.cols}, 1fr)`, gap: 12,
            width: '100%',
          }}>
            {Array.from({ length: count }).map((_, i) => {
              const photoIdx = selectedIndices[i];
              const p = photoIdx !== null ? myPhotos[photoIdx] : null;
              const isActive = activeSlot === i;

              return (
                <button
                  key={i}
                  onClick={() => handleSlotClick(i)}
                  style={{
                    aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden',
                    background: 'rgba(255,255,255,0.08)', cursor: 'pointer',
                    border: `2px ${isActive ? 'solid' : 'dashed'} ${isActive ? 'var(--accent)' : 'rgba(255,255,255,0.2)'}`,
                    padding: 0, position: 'relative', transition: 'all 0.2s',
                  }}
                >
                  {p?.dataUrl ? (
                    <img src={p.dataUrl} alt={`Slot ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.3)', fontSize: 24 }}>
                      +
                    </div>
                  )}
                  {isActive && !p && (
                    <div style={{ position: 'absolute', inset: 0, border: '2px solid var(--accent)', borderRadius: 8, pointerEvents: 'none', animation: 'pulse 1.5s infinite' }} />
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            style={{
              marginTop: 32, padding: '16px 40px', fontSize: 16, fontWeight: 700,
              borderRadius: 100, border: 'none', cursor: isComplete ? 'pointer' : 'not-allowed',
              background: isComplete ? 'var(--text)' : 'rgba(255,255,255,0.1)',
              color: isComplete ? 'var(--bg)' : 'var(--text-muted)',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 8
            }}
          >
            next <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
