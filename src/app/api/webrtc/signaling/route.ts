import { NextRequest, NextResponse } from 'next/server';

// In-memory хранилище для signaling (в продакшене использовать Redis или базу данных)
interface SignalingData {
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  iceCandidates: RTCIceCandidateInit[];
  roomId: string;
  timestamp: number;
}

const signalingStore = new Map<string, SignalingData>();

// Очистка старых данных (старше 5 минут)
setInterval(() => {
  const now = Date.now();
  for (const [roomId, data] of signalingStore.entries()) {
    if (now - data.timestamp > 5 * 60 * 1000) {
      signalingStore.delete(roomId);
    }
  }
}, 60000);

export async function POST(req: NextRequest) {
  try {
    const { roomId, type, data } = await req.json();

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID required' }, { status: 400 });
    }

    let signaling = signalingStore.get(roomId) || {
      iceCandidates: [],
      roomId,
      timestamp: Date.now(),
    };

    switch (type) {
      case 'offer':
        // Проверяем валидность offer
        if (!data || !data.type || !data.sdp) {
          return NextResponse.json({ error: 'Invalid offer format' }, { status: 400 });
        }
        signaling.offer = data;
        signaling.timestamp = Date.now();
        // Очищаем старый answer при новом offer
        signaling.answer = undefined;
        console.log(`Offer received for room ${roomId}`);
        break;
      case 'answer':
        // Проверяем валидность answer
        if (!data || !data.type || !data.sdp) {
          return NextResponse.json({ error: 'Invalid answer format' }, { status: 400 });
        }
        signaling.answer = data;
        signaling.timestamp = Date.now();
        console.log(`Answer received for room ${roomId}`);
        break;
      case 'ice-candidate':
        if (!data || !data.candidate) {
          return NextResponse.json({ error: 'Invalid ICE candidate format' }, { status: 400 });
        }
        // Ограничиваем количество кандидатов (максимум 100)
        if (signaling.iceCandidates.length < 100) {
          signaling.iceCandidates.push(data);
          signaling.timestamp = Date.now();
        }
        break;
      case 'clear':
        signalingStore.delete(roomId);
        console.log(`Room ${roomId} cleared`);
        return NextResponse.json({ success: true });
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    signalingStore.set(roomId, signaling);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Signaling POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const roomId = searchParams.get('roomId');
    const type = searchParams.get('type'); // 'offer', 'answer', 'ice-candidates'

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID required' }, { status: 400 });
    }

    const signaling = signalingStore.get(roomId);

    if (!signaling) {
      return NextResponse.json({ data: null });
    }

    switch (type) {
      case 'offer':
        return NextResponse.json({ data: signaling.offer });
      case 'answer':
        return NextResponse.json({ data: signaling.answer });
      case 'ice-candidates':
        return NextResponse.json({ data: signaling.iceCandidates });
      default:
        return NextResponse.json({
          data: {
            offer: signaling.offer,
            answer: signaling.answer,
            iceCandidates: signaling.iceCandidates,
          },
        });
    }
  } catch (error) {
    console.error('Signaling GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

