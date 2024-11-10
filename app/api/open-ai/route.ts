import { NextApiRequest } from 'next';
import { NextRequest } from 'next/server';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';
import { cookies } from 'next/headers';

dotenv.config();

const openai = new OpenAI({
	apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: NextApiRequest, resp: NextApiRequest) {
	const { reportContent, reportTypeName } = req.body;

	try {
		const prompt = `Analyze the following report content and determine a priority level from Low, Medium, High and Critical (where Low is lowest priority and Critical is highest priority) and provide only the value of the priority level which can be Low, Medium, High or Critical.\n\n
        Report: "${reportContent}/n/n${reportTypeName}"`;

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
		console.log('Priority level:', priority);
		return priority;
	} catch (error) {
		console.error('Error analyzing report content:', error);
		return 0; // Fallback priority
	}
}

export async function fetchPriority(
	reportContent: string,
	reportTypeName: string,
) {
	const cookie = cookies().get('session');

	try {
		const response = await fetch('/api/open-ai', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookie}`,
			},
			body: JSON.stringify({ reportContent, reportTypeName }),
		});

		// Check if the response is OK (status 200-299)
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		// If response is OK, parse the JSON
		const data = await response.json();
		console.log('Priority:', data.priority);
	} catch (error) {
		console.error('Error fetching priority:', error);
	}
}
