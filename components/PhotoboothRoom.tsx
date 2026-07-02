'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRoom } from '@/hooks/useRoom';
import { useWebRTC } from '@/hooks/useWebRTC';
import { LAYOUTS, LayoutKey } from '@/lib/types';
import { composeDuoPhoto } from '@/lib/composition';
import VideoGrid from './room/VideoGrid';
import PreviewModal from './room/PreviewModal';
import { SetupLayout, SetupTheme } from './room/WizardScreens';

interface Props {
  roomId: string;
  roomCode: string;
}

export default function PhotoboothRoom({ roomId, roomCode }: Props) {
  const {
    roomState, phase, changePhase, myPhotos, partnerPhotos,
    partnerInfo, countdown, photoIndex, role,
    startSession, onPhotoCaptured, updateState, handleReset,
  } = useRoom(roomId, roomCode);

  const { localStream, remoteStream, isConnected, facingMode, isMirrored, toggleCamera, toggleMirror } = useWebRTC(roomCode, role === 'host');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const [showResult, setShowResult] = useState(false);
  const [copyDone, setCopyDone] = useState(false);
  const [resultComposed, setResultComposed] = useState(false);
  const [resultImgUrl, setResultImgUrl] = useState<string>('');

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, phase]);

  // Attach remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, phase]);

  // Capture photo when phase transitions to 'capturing'
  const capturedRef = useRef(false);
  useEffect(() => {
    if (phase !== 'capturing') {
      capturedRef.current = false;
      return;
    }
    // Guard: only capture once per capture event
    if (capturedRef.current) return;
    capturedRef.current = true;

    // Flash effect
    if (flashRef.current) {
      flashRef.current.classList.add('active');
      setTimeout(() => flashRef.current?.classList.remove('active'), 400);
    }

    const captureVideo = (vid: HTMLVideoElement | null, mirrored: boolean) => {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d')!;
      if (!vid || vid.readyState < 2 || !vid.videoWidth) {
        // No video ready — return a dark placeholder
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📷 Tidak tersedia', 320, 240);
        return canvas.toDataURL('image/jpeg', 0.9);
      }
      canvas.width = vid.videoWidth;
      canvas.height = vid.videoHeight;
      ctx.save();
      if (mirrored) {
        ctx.scale(-1, 1);
        ctx.drawImage(vid, -canvas.width, 0, canvas.width, canvas.height);
      } else {
        ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
      }
      ctx.restore();
      return canvas.toDataURL('image/jpeg', 0.92);
    };

    const myDataUrl = captureVideo(localVideoRef.current, isMirrored);
    const partnerDataUrl = captureVideo(remoteVideoRef.current, false);
    
    onPhotoCaptured(myDataUrl, partnerDataUrl, photoIndex);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, photoIndex]);

  // Compose result canvas when entering customizing phase or state changes
  const composeResult = useCallback(async () => {
    if (!resultCanvasRef.current) return;
    const layout = LAYOUTS[roomState.layout as LayoutKey];
    const count = layout.count;
    const myUrls = myPhotos.slice(0, count).map(p => p?.dataUrl || '');
    const partnerUrls = partnerPhotos.slice(0, count).map(p => p?.dataUrl || '');

    await composeDuoPhoto({
      myPhotos: myUrls,
      partnerPhotos: partnerUrls,
      state: roomState,
      canvas: resultCanvasRef.current,
    });
    setResultImgUrl(resultCanvasRef.current.toDataURL('image/png'));
    setResultComposed(true);
  }, [roomState, myPhotos, partnerPhotos]);

  useEffect(() => {
    if (phase !== 'done') {
      setResultComposed(false);
      return;
    }
    composeResult().then(() => {
      setShowResult(true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, myPhotos, partnerPhotos]);

  // Re-compose if customization changes while in done phase (if they edit after result is shown)
  useEffect(() => {
    if (phase === 'done') {
      composeResult();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomState, phase]);

  const handleDownload = useCallback(() => {
    if (!resultImgUrl) return;
    const a = document.createElement('a');
    a.href = resultImgUrl;
    a.download = `photoboothduo-${roomCode}-${Date.now()}.png`;
    a.click();
  }, [roomCode, resultImgUrl]);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(`${window.location.origin}/room/${roomCode}`);
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 2000);
  }, [roomCode]);

  const partnerConnected = !!partnerInfo || isConnected;
  const totalCount = LAYOUTS[roomState.layout as LayoutKey]?.count || 3;

  if (phase === 'waiting_partner') {
    return (
      <div className="landing-page" style={{ justifyContent: 'center', position: 'relative' }}>
        <div className="landing-bg" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <div className="profile-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        
        <div style={{ textAlign: 'center', width: '100%', maxWidth: 500, zIndex: 1 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>YOUR CODE</p>
          
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
            {roomCode.split('').map((char, i) => (
              <div key={i} style={{ width: 56, height: 72, background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, backdropFilter: 'blur(10px)', border: '1px solid var(--border)', boxShadow: 'var(--accent-glow)' }}>
                {char}
              </div>
            ))}
          </div>

          <button onClick={copyLink} style={{ padding: '8px 16px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid var(--border)', borderRadius: 100, fontSize: 14, fontWeight: 600, color: 'var(--text)', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 40, cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
            {copyDone ? 'copied!' : 'copy link'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24, fontSize: 14, color: 'var(--text-muted)' }}>
            <span style={{ width: 8, height: 8, border: '2px solid var(--text-muted)', borderRadius: '50%' }}></span>
            {partnerConnected ? 'partner connected!' : 'waiting for partner...'}
          </div>

          {role === 'host' && (
            <button 
              onClick={() => changePhase('setup_layout')}
              disabled={!partnerConnected}
              style={{ width: '100%', maxWidth: 280, padding: '16px 24px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: partnerConnected ? 1 : 0.5, borderRadius: 100, border: 'none', background: 'var(--text)', color: 'var(--bg)', fontWeight: 700, fontSize: 16, cursor: partnerConnected ? 'pointer' : 'not-allowed', transition: 'all 0.2s', boxShadow: partnerConnected ? 'var(--accent-glow)' : 'none' }}
            >
              Pilih Layout & Tema <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3l14 9-14 9V3z"/></svg>
            </button>
          )}

          <div style={{ marginTop: 40 }}>
            <a href="/" style={{ fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>← back</a>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'setup_layout') {
    return <SetupLayout roomState={roomState} updateState={updateState} nextStep={() => changePhase('setup_theme')} role={role} />;
  }

  if (phase === 'setup_theme') {
    return <SetupTheme roomState={roomState} updateState={updateState} nextStep={() => changePhase('ready_to_capture')} prevStep={() => changePhase('setup_layout')} role={role} />;
  }

  return (
    <div className="room-layout-clean">
      <VideoGrid
        remoteStream={remoteStream}
        roomState={roomState}
        role={role}
        partnerInfo={partnerInfo}
        isConnected={isConnected}
        roomCode={roomCode}
        phase={phase}
        countdown={countdown}
        photoIndex={photoIndex}
        totalCount={totalCount}
        flashRef={flashRef}
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        myPhotos={myPhotos}
        startSession={startSession}
        partnerConnected={partnerConnected}
        facingMode={facingMode}
        isMirrored={isMirrored}
        toggleCamera={toggleCamera}
        toggleMirror={toggleMirror}
      />


      <canvas
        ref={resultCanvasRef}
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      <PreviewModal
        showResult={showResult}
        setShowResult={setShowResult}
        resultComposed={resultComposed}
        resultImgUrl={resultImgUrl}
        handleDownload={handleDownload}
        handleReset={handleReset}
      />
    </div>
  );
}
