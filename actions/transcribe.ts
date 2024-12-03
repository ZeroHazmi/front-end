"use server";
import OpenAI from "openai";

async function transcribe(prevState: any, formData: FormData) {
	const file = formData.get("audio") as File;

	if (file.size === 0) {
		return {
			sender: "",
			message: "No audio file found",
		};
	}

	let language = formData.get("language") as string;
	if (language == "bm") {
		language = "ms";
	} else {
		language = "en";
	}

	console.log(">>>", file);

	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	try {
		// Transcribe audio using OpenAI's Whisper model
		const transcription = await openai.audio.transcriptions.create({
			file: file, // The audio file to transcribe
			model: "whisper-1", // Specify the Whisper model
			language: language, // Specify the language
		});

		console.log(">>>", transcription);

		// Return the transcription result
		return {
			sender: "Whisper",
			message: transcription.text, // The transcribed text
		};
	} catch (error) {
		// Handle errors
		console.error("Error transcribing audio:", error);
		return {
			sender: "Whisper",
			message: "Error transcribing the audio file",
		};
	}
}
export default transcribe;
