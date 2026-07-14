import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * POST /api/rooms/heartbeat
 * Body: { roomCode: string }
 * 
 * Called every ~60s by clients inside a room.
 * Updates last_active_at so the cleanup job knows the room is still occupied.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { roomCode } = body as { roomCode?: string };

    if (!roomCode || typeof roomCode !== 'string') {
      return NextResponse.json({ error: 'roomCode required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('rooms')
      .update({ last_active_at: new Date().toISOString() })
      .eq('room_code', roomCode.toUpperCase());

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
