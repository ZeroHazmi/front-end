import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { cookies } from 'next/headers';

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Type definitions
type ReportRequest = {
	reportTypeID: string;
	reportContent: string;
	reportTypeName: string;
	location: string;
	date: Date;
	time: number;
};

type ReportData = {
	reportTypeId: string;
	status: string;
	priority: string;
	reportDetail: {
		reportTypeId: string;
		date: number;
		location: string;
		time: number;
		fieldValue: string;
		audio: string;
		image: string;
		transcript: string;
	};
};

export async function POST(request: Request) {
	try {
		// Get request body and parse it
		const body: ReportRequest = await request.json();
		const {
			reportTypeID,
			reportContent,
			reportTypeName,
			location,
			date,
			time,
		} = body;

		// Get authentication token from cookies
		const cookieStore = cookies();
		const authToken = cookieStore.get('session');

		if (!authToken) {
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 },
			);
		}

		// Generate priority using OpenAI
		const prompt = `Analyze the following report content and determine a priority level from Low, Medium, High, and Critical (where Low is lowest priority and Critical is highest priority) and provide only the value of the priority level which can be Low, Medium, High or Critical.\n\nReport: "${reportContent}\n\n${reportTypeName}"`;

		try {
			const priorityResponse = await openai.chat.completions.create({
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

			const priority =
				priorityResponse.choices[0].message?.content?.trim() || 'Low';

			

			// Prepare report data
			const reportData: ReportData = {
				reportTypeId: reportTypeID,
				status: 'Open',
				priority,
				reportDetail: {
					reportTypeId: reportTypeID,
					date: date.getTime(),
					location: location || '',
					time: time,
					fieldValue: '',
					audio: '',
					image: '',
					transcript: reportContent,
				},
			};

			console.log('Report data:', reportData);

			// Create report in backend API
			const createReportResponse = await fetch(
				'http://localhost:5035/api/report/create',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json-patch+json',
						Authorization: `Bearer ${authToken.value}`,
					},
					body: JSON.stringify(reportData),
				},
			);

			if (!createReportResponse.ok) {
				const errorData = await createReportResponse.json();
				console.error('Failed to create report:', errorData);
				return NextResponse.json(
					{ error: 'Failed to create report' },
					{ status: createReportResponse.status },
				);
			}

			return NextResponse.json(
				{ success: true, message: 'Report created successfully' },
				{ status: 200 },
			);
		} catch (openAiError) {
			console.error('OpenAI API error:', openAiError);
			return NextResponse.json(
				{ error: 'Failed to analyze report priority' },
				{ status: 500 },
			);
		}
	} catch (error) {
		console.error('Error processing request:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
