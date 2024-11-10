// pages/api/priority.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai'; // Import OpenAI SDK

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // Ensure the key is in your environment
});

// Priority API route
export default async function POST(req: NextApiRequest, res: NextApiResponse) {
	const { reportContent, reportTypeName } = req.body;

	if (!reportContent || !reportTypeName) {
		return res
			.status(400)
			.json({ error: 'Missing reportContent or reportTypeName' });
	}

	try {
		const prompt = `Analyze the following report content and determine a priority level from Low, Medium, High and Critical (where Low is lowest priority and Critical is highest priority) and provide only the value of the priority level which can be Low, Medium, High or Critical.\n\nReport: "${reportContent}/n/n${reportTypeName}"`;

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
		return res.status(200).json({ priority });
	} catch (error) {
		console.error('Error analyzing report content:', error);
		return res
			.status(500)
			.json({ error: 'Error analyzing report content' });
	}
}
