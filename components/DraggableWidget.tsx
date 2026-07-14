'use client';

import { useRef, useLayoutEffect, useEffect, useState, ReactNode } from 'react';

interface DraggableWidgetProps {
  children: ReactNode;
  storageKey: string;
  /** Initial left offset in px */
  defaultX?: number;
  /** Initial top offset in px — use a large value (e.g. 9999) to snap to bottom/right edge */
  defaultY?: number;
  /** 'absolute' = positioned within nearest positioned ancestor (default)
   *  'fixed'    = positioned within the viewport */
  mode?: 'absolute' | 'fixed';
  style?: React.CSSProperties;
}

export default function DraggableWidget({
  children,
  storageKey,
  defaultX = 16,
  defaultY = 16,
  mode = 'absolute',
  style,
}: DraggableWidgetProps) {
  const elRef = useRef<HTMLDivElement>(null);

  // posRef = live source of truth (mutated directly for smooth drag, no re-render)
  const posRef = useRef({ x: defaultX, y: defaultY });

  // Cached bounds — measured once at pointerDown to avoid layout thrash on every move
  const boundsRef = useRef({ maxX: 9999, maxY: 9999 });

  const dragRef = useRef({ active: false, startCX: 0, startCY: 0, startEX: 0, startEY: 0 });

  // cssPos drives the React style prop — synced with posRef at mount + drag end
  // so parent re-renders never reset the position back to defaults
  const [cssPos, setCssPos] = useState({ x: defaultX, y: defaultY });
  const [ready, setReady] = useState(false);

  /** Measure max x/y bounds from the actual container */
  const measureBounds = (): { maxX: number; maxY: number } => {
    const el = elRef.current;
    if (!el) return { maxX: 9999, maxY: 9999 };
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    if (mode === 'fixed') {
      return { maxX: window.innerWidth - w, maxY: window.innerHeight - h };
    }
    const parent = el.offsetParent as HTMLElement | null;
    if (!parent) return { maxX: 9999, maxY: 9999 };
    return { maxX: parent.offsetWidth - w, maxY: parent.offsetHeight - h };
  };

  /** Clamp + apply position to DOM and posRef. Returns clamped coords. */
  const applyPos = (x: number, y: number, bounds = boundsRef.current): { nx: number; ny: number } => {
    const nx = Math.max(0, Math.min(x, bounds.maxX));
    const ny = Math.max(0, Math.min(y, bounds.maxY));
    posRef.current = { x: nx, y: ny };
    if (elRef.current) {
      elRef.current.style.left = `${nx}px`;
      elRef.current.style.top = `${ny}px`;
    }
    return { nx, ny };
  };

  // Mount: restore from localStorage, clamp to real container, sync state
  useLayoutEffect(() => {
    let p = { x: defaultX, y: defaultY };
    try {
      const saved = localStorage.getItem(`dw_${storageKey}`);
      if (saved) p = JSON.parse(saved);
    } catch {}
    const bounds = measureBounds();
    boundsRef.current = bounds;
    const { nx, ny } = applyPos(p.x, p.y, bounds);
    setCssPos({ x: nx, y: ny });
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Resize/orientation-change: re-clamp so widget never goes out of bounds
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      // Debounce slightly so we don't thrash during animated resizes
      clearTimeout(timer);
      timer = setTimeout(() => {
        const bounds = measureBounds();
        boundsRef.current = bounds;
        const { nx, ny } = applyPos(posRef.current.x, posRef.current.y, bounds);
        setCssPos({ x: nx, y: ny });
      }, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Pointer handlers ──────────────────────────────────────────────────────

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Measure bounds ONCE at drag start — avoids layout thrash on every move event
    boundsRef.current = measureBounds();
    dragRef.current = {
      active: true,
      startCX: e.clientX,
      startCY: e.clientY,
      startEX: posRef.current.x,
      startEY: posRef.current.y,
    };
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startCX;
    const dy = e.clientY - dragRef.current.startCY;
    // Use cached bounds — no layout read on every frame
    applyPos(dragRef.current.startEX + dx, dragRef.current.startEY + dy);
  };

  /** Commit the drag: sync React state + persist to localStorage */
  const commitDrag = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    const { x, y } = posRef.current;
    setCssPos({ x, y }); // sync so future React renders don't reset position
    try {
      localStorage.setItem(`dw_${storageKey}`, JSON.stringify({ x, y }));
    } catch {}
  };

  return (
    <div
      ref={elRef}
      style={{
        position: mode,
        left: cssPos.x,
        top: cssPos.y,
        zIndex: 55,
        // NOTE: touchAction and userSelect are intentionally on the HANDLE only,
        // not here — so children (e.g. scrollable filter list) are not affected
        opacity: ready ? 1 : 0,
        transition: 'opacity 0.15s',
        ...style,
      }}
    >
      {/* ── Drag handle ── */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={commitDrag}
        onPointerCancel={commitDrag}
        title="Drag to move"
        style={{
          cursor: 'grab',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '4px 8px',
          color: 'rgba(255,255,255,0.4)',
          touchAction: 'none',  // prevents browser scroll/pan from hijacking drag
          userSelect: 'none',   // prevents text selection during drag
          transition: 'color 0.15s',
        }}
        onPointerEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)'; }}
        onPointerLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; }}
      >
        {/* 2×3 grip dots */}
        <svg width="18" height="10" viewBox="0 0 18 10" fill="currentColor" aria-hidden="true">
          <circle cx="3"  cy="2.5" r="1.5" />
          <circle cx="9"  cy="2.5" r="1.5" />
          <circle cx="15" cy="2.5" r="1.5" />
          <circle cx="3"  cy="7.5" r="1.5" />
          <circle cx="9"  cy="7.5" r="1.5" />
          <circle cx="15" cy="7.5" r="1.5" />
        </svg>
      </div>

      {children}
    </div>
  );
}
