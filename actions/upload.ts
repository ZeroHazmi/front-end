'use server';

import OpenAI from 'openai';
import fs from 'fs';

// Function to encode the image
// async function encodeImage(imagePath: string): Promise<string> {
// 	const imageBuffer = await fs.promises.readFile(imagePath);
// 	return imageBuffer.toString('base64');
// }

export async function analyzeImage(base64Image: string): Promise<string> {
	// Initialize the OpenAI client
	console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY);
	const openai = new OpenAI({
		apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
	});

	try {
		const response = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: 'The Image given is a Malaysian Identity Card. Extract the informatino on the Card. This card contain no information about the person. ',
						},
						{
							type: 'image_url',
							image_url: {
								url: `data:image/jpeg;base64,${base64Image}`,
							},
						},
					],
				},
			],
		});

		console.log('Image analysis response:', response);

		return (
			response.choices[0].message?.content || 'No analysis result found.'
		);
	} catch (error) {
		console.error('Error analyzing image:', error);
		throw new Error('Failed to analyze image.');
	}
}

// Utility function to convert Blob to base64
function blobToBase64(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}


