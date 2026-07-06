import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cleanupExpiredRooms, generateRoomCode, getRoomExpiresAt } from '@/lib/roomUtils';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { promoCode } = body;
    const isUnlimited = promoCode === 'akuselaludi-sini';

    let roomCode = '';
    let attempts = 0;
    let created = false;

    await cleanupExpiredRooms().catch(() => undefined);

    while (attempts < 5) {
      roomCode = generateRoomCode();

      const expiresAt = isUnlimited
        ? new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString()
        : getRoomExpiresAt();

      const { error } = await supabase.from('rooms').insert({
        room_code: roomCode,
        status: 'waiting',
        expires_at: expiresAt,
      });

      if (!error) {
        created = true;
        break;
      }
      attempts++;
    }

    if (!created) {
      return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
    }

    return NextResponse.json({ roomCode });
  } catch {
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 });
  }
}
