import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
	const body = await req.json();

	const base64Audio = body.audio;

	// Convert the base64 audio data to a Buffer
	const audio = Buffer.from(base64Audio, 'base64');

	// Define the file path for storing the temporary audio file (webm from client)
	const filePath = 'tmp/input.webm';

	// Ensure API key is available at runtime
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		console.error('OPENAI_API_KEY is missing');
		return NextResponse.json({ error: 'OPENAI_API_KEY is not configured on the server.' }, { status: 500 });
	}

	const openai = new OpenAI({ apiKey });

	try {
		// Ensure tmp directory exists
		try {
			fs.mkdirSync('tmp', { recursive: true });
		} catch (e) {
			// ignore
		}

		// Write the audio data to a temporary WAV file
		fs.writeFileSync(filePath, audio);

		// Create a readable stream from the temporary WAV file
		const readStream = fs.createReadStream(filePath);

		const data = await openai.audio.transcriptions.create({
			file: readStream,
			model: 'whisper-1',
		});

		// Remove the temporary file after successful processing
		try {
			fs.unlinkSync(filePath);
		} catch (e) {
			// ignore
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error('Error processing audio:', error);
		return NextResponse.json({ error: 'Failed to process audio' }, { status: 500 });
	}
}
