export type LayoutKey = 'strip2' | 'strip3' | 'strip4' | 'strip5' | 'grid2x2' | 'grid3x2' | 'single';

export interface LayoutDef {
  count: number;
  cols: number;
  rows: number;
}

export interface RoomState {
  layout: LayoutKey;
  sessionCount: number;
  timer: number;
  frameBg: { type: 'solid' | 'gradient' | 'pattern'; val: string };
  photoBorder: string;
  customText: string;
  showDate: boolean;
}

export interface CapturedPhoto {
  dataUrl: string;
  participantId: string;
  index: number;
}

export interface RealtimeMessage {
  type:
    | 'countdown_start'
    | 'countdown_tick'
    | 'photo_captured'
    | 'state_update'
    | 'phase_update'
    | 'session_reset'
    | 'participant_ready'
    | 'partner_joined'
    | 'sdp_offer'
    | 'sdp_answer'
    | 'ice_candidate';
  senderId: string;
  payload?: unknown;
}

export interface ParticipantInfo {
  id: string;
  role: 'host' | 'guest';
  isReady: boolean;
}

export type RoomStatus = 'waiting' | 'active' | 'done';
export type SessionPhase =
  | 'waiting_partner'
  | 'setup_layout'
  | 'setup_theme'
  | 'ready_to_capture'
  | 'countdown'
  | 'capturing'
  | 'error_full'
  | 'done';

export const LAYOUTS: Record<LayoutKey, LayoutDef> = {
  strip2: { count: 2, cols: 1, rows: 2 },
  strip3: { count: 3, cols: 1, rows: 3 },
  strip4: { count: 4, cols: 1, rows: 4 },
  strip5: { count: 5, cols: 1, rows: 5 },
  grid2x2: { count: 4, cols: 2, rows: 2 },
  grid3x2: { count: 6, cols: 2, rows: 3 },
  single: { count: 1, cols: 1, rows: 1 },
};

export const FRAME_BG_PRESETS = [
  { id: 'white', label: 'white', type: 'solid' as const, val: '#ffffff', style: { background: '#ffffff' } },
  { id: 'cream', label: 'cream', type: 'solid' as const, val: '#f5efdf', style: { background: '#f5efdf' } },
  { id: 'pink', label: 'pink', type: 'solid' as const, val: '#f8c8d8', style: { background: '#f8c8d8' } },
  { id: 'black', label: 'black', type: 'solid' as const, val: '#0a0a0a', style: { background: '#0a0a0a' } },
  { id: 'pastel', label: 'pastel', type: 'gradient' as const, val: '#ff9a9e,#fecfef', style: { background: 'linear-gradient(135deg, #ff9a9e, #fecfef)' } },
  { id: 'lavender', label: 'lavender', type: 'gradient' as const, val: '#a18cd1,#fbc2eb', style: { background: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' } },
  { id: 'mint', label: 'mint', type: 'gradient' as const, val: '#84fab0,#8fd3f4', style: { background: 'linear-gradient(135deg, #84fab0, #8fd3f4)' } },
  { id: 'peach', label: 'peach', type: 'gradient' as const, val: '#ffecd2,#fcb69f', style: { background: 'linear-gradient(135deg, #ffecd2, #fcb69f)' } },
  { id: 'dark_blue', label: 'night', type: 'gradient' as const, val: '#30cfd0,#330867', style: { background: 'linear-gradient(135deg, #30cfd0, #330867)' } },
];

export const BORDER_PRESETS = [
  { id: 'plain', label: 'Polos' },
  { id: 'polaroid', label: 'Polaroid' },
  { id: 'film', label: 'Film' },
  { id: 'neon', label: 'Neon Glow' },
  { id: 'romantic', label: 'Romantis', emoji: ['💖', '🌹', '💌', '💕'] },
  { id: 'birthday', label: 'Ulang Tahun', emoji: ['🎂', '🎈', '🎉', '🧁'] },
  { id: 'sakura', label: 'Sakura', emoji: ['🌸', '🍡', '🌸', '✨'] },
  { id: 'galaxy', label: 'Galaxy', emoji: ['🌌', '⭐', '🚀', '🪐'] },
  { id: 'summer', label: 'Summer', emoji: ['☀️', '🌴', '🏖️', '🍍'] },
  { id: 'christmas', label: 'Natal', emoji: ['❄️', '🎄', '🎁', '✨'] },
];
