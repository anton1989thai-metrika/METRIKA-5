import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

let openaiClient: OpenAI | null | undefined;

const getOpenAIClient = () => {
  if (openaiClient !== undefined) return openaiClient;
  const apiKey = process.env.OPENAI_API_KEY || '';
  openaiClient = apiKey ? new OpenAI({ apiKey }) : null;
  return openaiClient;
};

export async function POST(req: Request) {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return NextResponse.json({ error: 'OPENAI_API_KEY не задан' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : null;
    if (!messages) {
      return NextResponse.json({ error: 'messages должны быть массивом' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of completion) {
          const content = chunk.choices?.[0]?.delta?.content || '';
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    return new NextResponse(stream);
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
