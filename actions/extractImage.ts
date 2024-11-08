import { createWorker } from 'tesseract.js';

async function extractTextFromImage(imagePath) {
	// Create and initialize the Tesseract worker
	const worker = await createWorker('eng+msa');

	try {
		// Recognize the text in the image
		const {
			data: { text },
		} = await worker.recognize(imagePath);

		// Return the extracted text
		console.log('Extracted Text:', text);
		return text;
	} catch (error) {
		console.error('Error recognizing text:', error);
		throw error;
	} finally {
		// Terminate the worker after recognition
		await worker.terminate();
	}
}

// Example usage
(async () => {
	try {
		const text = await extractTextFromImage(
			'https://tesseract.projectnaptha.com/img/eng_bw.png',
		);
		console.log('Extracted Text:', text);
	} catch (error) {
		console.error('Failed to extract text:', error);
	}
})();


