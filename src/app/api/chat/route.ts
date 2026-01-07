import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

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

