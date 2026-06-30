'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getParticipantId, joinRoom, getParticipantsCount, updateRoomStatus } from '@/lib/roomUtils';
import {
  RoomState,
  RealtimeMessage,
  ParticipantInfo,
  SessionPhase,
  CapturedPhoto,
  COLOR_FILTERS,
  LAYOUTS,
  LayoutKey,
} from '@/lib/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

const DEFAULT_STATE: RoomState = {
  layout: 'strip4',
  sessionCount: 4,
  timer: 3,
  color: 'none',
  colorCSS: 'none',
  frameBg: { type: 'solid', val: '#ffffff' },
  photoBorder: 'plain',
  customText: '',
  showDate: true,
  adj: { b: 100, c: 100, s: 100, w: 0 },
};

export function useRoom(roomId: string, roomCode: string) {
  const participantId = getParticipantId();

  const [roomState, setRoomState] = useState<RoomState>(DEFAULT_STATE);
  const [phase, setPhase] = useState<SessionPhase | 'error_full'>('idle');
  const [myPhotos, setMyPhotos] = useState<CapturedPhoto[]>([]);
  const [partnerPhotos, setPartnerPhotos] = useState<CapturedPhoto[]>([]);
  const [partnerInfo, setPartnerInfo] = useState<ParticipantInfo | null>(null);
  const [partnerReady, setPartnerReady] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [role, setRole] = useState<'host' | 'guest'>('host');

  const channelRef = useRef<RealtimeChannel | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;

    async function setup() {
      const { data: existing } = await supabase
        .from('room_participants')
        .select('*')
        .eq('room_id', roomId)
        .eq('participant_id', participantId)
        .single();
        
      const count = await getParticipantsCount(roomId);
      
      if (!existing && count >= 2) {
        if (mounted) setPhase('error_full');
        return;
      }

      const assignedRole: 'host' | 'guest' = count === 0 || existing?.role === 'host' ? 'host' : 'guest';
      if (mounted) setRole(assignedRole);

      await joinRoom(roomId, participantId, assignedRole);

      const channel = supabase.channel(`room:${roomCode}`, {
        config: { broadcast: { self: false } },
      });

      channel
        .on('broadcast', { event: 'message' }, ({ payload }: { payload: RealtimeMessage }) => {
          if (!mounted) return;
          handleIncoming(payload);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            broadcast({ type: 'partner_joined', senderId: participantId, payload: { role: assignedRole } });
          }
        });

      channelRef.current = channel;
    }

    setup();

    return () => {
      mounted = false;
      channelRef.current?.unsubscribe();
      if (countdownRef.current) clearTimeout(countdownRef.current);
    };
  }, [roomId, roomCode, participantId]);

  const broadcast = useCallback((msg: RealtimeMessage) => {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'message',
      payload: msg,
    });
  }, []);

  const handleIncoming = useCallback((msg: RealtimeMessage) => {
    switch (msg.type) {
      case 'partner_joined': {
        const p = msg.payload as { role: 'host' | 'guest' };
        setPartnerInfo({ id: msg.senderId, role: p.role, isReady: false });
        break;
      }
      case 'participant_ready': {
        setPartnerReady(true);
        break;
      }
      case 'countdown_start': {
        const { timerVal, totalCount } = msg.payload as { timerVal: number; totalCount: number };
        runCountdown(timerVal, totalCount, false);
        break;
      }
      case 'photo_captured': {
        const { dataUrl, index } = msg.payload as { dataUrl: string; index: number };
        setPartnerPhotos(prev => {
          const next = [...prev];
          next[index] = { dataUrl, participantId: msg.senderId, index };
          return next;
        });
        break;
      }
      case 'state_update': {
        setRoomState(msg.payload as RoomState);
        break;
      }
      case 'session_reset': {
        handleReset(false);
        break;
      }
    }
  }, []);

  const runCountdown = useCallback((timerVal: number, totalCount: number, isMaster: boolean) => {
    setPhase('countdown');
    let current = timerVal;
    setCountdown(current);

    const tick = () => {
      current--;
      setCountdown(current);
      if (current > 0) {
        countdownRef.current = setTimeout(tick, 1000);
      } else {
        setPhase('capturing');
      }
    };

    countdownRef.current = setTimeout(tick, 1000);
  }, []);

  const startSession = useCallback(() => {
    const totalCount = LAYOUTS[roomState.layout as LayoutKey]?.count || 4;
    setMyPhotos([]);
    setPartnerPhotos([]);
    setPhotoIndex(0);
    setPhase('countdown');

    broadcast({
      type: 'countdown_start',
      senderId: participantId,
      payload: { timerVal: 3, totalCount },
    });

    runCountdown(3, totalCount, true);
  }, [roomState, broadcast, participantId, runCountdown]);

  const onPhotoCaptured = useCallback((dataUrl: string, index: number) => {
    setMyPhotos(prev => {
      const next = [...prev];
      next[index] = { dataUrl, participantId, index };
      return next;
    });

    broadcast({
      type: 'photo_captured',
      senderId: participantId,
      payload: { dataUrl, index },
    });

    const totalCount = LAYOUTS[roomState.layout as LayoutKey]?.count || 4;

    if (index + 1 >= totalCount) {
      setTimeout(() => {
        setPhase('customizing');
        updateRoomStatus(roomId, 'active');
      }, 800);
    } else {
      setPhotoIndex(index + 1);
      setPhase('countdown');
      
      const burstDelay = 2;
      
      broadcast({
        type: 'countdown_start',
        senderId: participantId,
        payload: { timerVal: burstDelay, totalCount },
      });
      runCountdown(burstDelay, totalCount, true);
    }
  }, [broadcast, participantId, roomState, roomId, runCountdown]);

  const updateState = useCallback((partial: Partial<RoomState>) => {
    setRoomState(prev => {
      const next = { ...prev, ...partial };
      broadcast({ type: 'state_update', senderId: participantId, payload: next });
      return next;
    });
  }, [broadcast, participantId]);

  const setColor = useCallback((colorId: string) => {
    const found = COLOR_FILTERS.find(f => f.id === colorId);
    updateState({ color: colorId, colorCSS: found?.css || 'none' });
  }, [updateState]);

  const handleReset = useCallback((andBroadcast = true) => {
    setMyPhotos([]);
    setPartnerPhotos([]);
    setPhotoIndex(0);
    setPhase('idle');
    setCountdown(0);
    if (countdownRef.current) clearTimeout(countdownRef.current);
    if (andBroadcast) {
      broadcast({ type: 'session_reset', senderId: participantId });
    }
  }, [broadcast, participantId]);

  return {
    roomState,
    phase,
    myPhotos,
    partnerPhotos,
    partnerInfo,
    partnerReady,
    countdown,
    photoIndex,
    participantId,
    role,
    startSession,
    onPhotoCaptured,
    updateState,
    setColor,
    handleReset,
    broadcast,
  };
}
