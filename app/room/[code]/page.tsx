import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PhotoboothRoom from '@/components/PhotoboothRoom';
import { supabase } from '@/lib/supabase';
import { getRoomCreatedAfter, ROOM_TTL_MS } from '@/lib/roomUtils';

export const dynamic = 'force-dynamic';

interface Props {
  params: { code: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Room ${params.code.toUpperCase()} — BoothKita`,
    description: 'Sesi foto berdua secara online real-time',
  };
}

export default async function RoomPage({ params }: Props) {
  const code = params.code.toUpperCase();

  const { data: room } = await supabase
    .from('rooms')
    .select('*')
    .eq('room_code', code)
    .gt('expires_at', new Date().toISOString())
    .gt('created_at', getRoomCreatedAfter())
    .single();

  if (!room) {
    notFound();
  }

  const createdExpiry = new Date(new Date(room.created_at).getTime() + ROOM_TTL_MS).toISOString();
  const roomExpiresAt = new Date(Math.min(new Date(room.expires_at).getTime(), new Date(createdExpiry).getTime())).toISOString();

  return <PhotoboothRoom roomId={room.id} roomCode={code} roomExpiresAt={roomExpiresAt} />;
}
