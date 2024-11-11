import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai'; // Import OpenAI SDK

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Ensure the key is in your environment
});

export async function POST(req: NextRequest) {
  try {
    const { reportContent, reportTypeName } = await req.json();

    if (!reportContent || !reportTypeName) {
      return NextResponse.json({ error: 'Missing reportContent or reportTypeName' }, { status: 400 });
    }

    const prompt = `Analyze the following report content and determine a priority level from Low, Medium, High, and Critical (where Low is lowest priority and Critical is highest priority) and provide only the value of the priority level which can be Low, Medium, High or Critical.\n\nReport: "${reportContent}/n/n${reportTypeName}"`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant helping to prioritize police reports based on content analysis.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 10,
      temperature: 0.5,
    });

    const priority = response.choices[0].message?.content?.trim() ?? 'Low';
    return NextResponse.json({ priority }, { status: 200 });
  } catch (error) {
    console.error('Error analyzing report content:', error);
    return NextResponse.json({ error: 'Error analyzing report content' }, { status: 500 });
  }
}
