import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getRoomCreatedAfter } from '@/lib/roomUtils';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code.toUpperCase();

    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_code', code)
      .gt('expires_at', new Date().toISOString())
      .gt('created_at', getRoomCreatedAfter())
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Room not found or expired' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to get room' }, { status: 500 });
  }
}
