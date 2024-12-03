import axios from "axios";
import {NextRequest, NextResponse} from "next/server";
import fs from "fs";

export async function POST(req: NextRequest) {
	// Retrieve API key from environment variables
	const PIXLAB_API_KEY = process.env.PIXLAB_API_KEY;

	if (!PIXLAB_API_KEY) {
		return NextResponse.json(
			{error: "Pixlab API key is not configured"},
			{status: 500}
		);
	}

	try {
		// Parse the incoming form data
		const formData = await req.formData();
		console.log(formData);

		// Create a new FormData for Pixlab API
		const pixlabFormData = new FormData();

		// Append file and type
		const file = formData.get("file") as File;
		pixlabFormData.append("file", file);
		pixlabFormData.append("type", "idcard");
		pixlabFormData.append("country", "Malaysia");
		pixlabFormData.append("key", PIXLAB_API_KEY);

		// Call the Pixlab API with the FormData
		const response = await axios.post(
			"https://api.pixlab.io/docscan",
			pixlabFormData,
			{
            headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);

		// Extract and process the response
		const reply = response.data;

		if (reply.status !== 200) {
			return NextResponse.json(
				{error: reply.error},
				{status: reply.status}
			);
		}

		// Prepare a structured response with extracted information
		return NextResponse.json({
			faceUrl: reply.face_url,
			mrzRawText: reply.mrz_raw_text,
			extractedFields: {
				issuingCountry: reply.fields.issuingCountry,
				fullName: reply.fields.fullName,
				documentNumber: reply.fields.documentNumber,
				checkDigit: reply.fields.checkDigit,
				nationality: reply.fields.nationality,
				dateOfBirth: reply.fields.dateOfBirth,
				sex: reply.fields.sex,
				dateOfExpiry: reply.fields.dateOfExpiry,
				personalNumber: reply.fields.personalNumber,
				finalCheckDigit: reply.fields.finalcheckDigit,
			},
		});
	} catch (error: any) {
		console.error(
			"Pixlab API Error:",
			error.response?.data || error.message
		);

		return NextResponse.json(
			{
				error:
					error.response?.data?.error ||
					"Failed to connect to Pixlab API",
				details: error.response?.data || null,
			},
			{status: error.response?.status || 500}
		);
	}
}

// CORS handling
export async function OPTIONS(req: NextRequest) {
	return new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	});
}
