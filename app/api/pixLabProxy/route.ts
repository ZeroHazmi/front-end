import axios from "axios";
import {NextRequest, NextResponse} from "next/server";
import fs from "fs";
import { states } from "@/types/constants"

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

		// Prepare a normalized, structured response with extracted information
		const extracted = reply.fields || reply.extractedFields || {};

		const normalizeDate = (d?: any) => {
			if (!d) return "";
			const s = String(d).trim();
			if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
			let m;
			if ((m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/))) {
				return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
			}
			if ((m = s.match(/^(\d{4})(\d{2})(\d{2})$/))) {
				return `${m[1]}-${m[2]}-${m[3]}`;
			}
			const parsed = new Date(s);
			if (!Number.isNaN(parsed.getTime())) {
				return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`;
			}
			return "";
		};

		const mapGender = (g?: any) => {
			if (!g) return "";
			const s = String(g).toLowerCase();
			if (s.startsWith('m') || s === 'male') return 'male';
			if (s.startsWith('f') || s === 'female') return 'female';
			return s;
		};

		const extractPostcode = (txt?: any) => {
			if (!txt) return "";
			const m = String(txt).match(/\b(\d{5})\b/);
			return m ? m[1] : "";
		};

		const detectStateKey = (txt?: any) => {
			if (!txt) return "";
			const lower = String(txt).toLowerCase();
			for (const [k, label] of Object.entries(states)) {
				if (label && lower.includes(String(label).toLowerCase())) return k;
			}
			// simple fallback: try normalized substring matching
			const normalize = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');
			const target = normalize(String(txt));
			let best: { key: string; score: number } | null = null;
			const levenshtein = (a: string, b: string) => {
				const al = a.length, bl = b.length;
				const dp: number[][] = Array.from({ length: al + 1 }, () => Array(bl + 1).fill(0));
				for (let i = 0; i <= al; i++) dp[i][0] = i;
				for (let j = 0; j <= bl; j++) dp[0][j] = j;
				for (let i = 1; i <= al; i++) {
					for (let j = 1; j <= bl; j++) {
						const cost = a[i - 1] === b[j - 1] ? 0 : 1;
						dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
					}
				}
				return dp[al][bl];
			};
			for (const [k, label] of Object.entries(states)) {
				const lab = normalize(String(label));
				const dist = levenshtein(lab, target);
				const maxLen = Math.max(lab.length, target.length) || 1;
				const score = dist / maxLen;
				if (!best || score < best.score) best = { key: k, score };
			}
			if (best && best.score < 0.45) return best.key;
			return "";
		};

		const addressText = [
			extracted.address,
			extracted.fullAddress,
			extracted.fullAddressText,
			reply.fullAddress,
			reply.address,
			extracted.issuingState,
			extracted.mrz || reply.mrz_raw_text,
		].filter(Boolean).join(' ');

		const mapped = {
			faceUrl: reply.face_url,
			mrzRawText: reply.mrz_raw_text,
			name: extracted.fullName || extracted.full_name || reply.fullName || "",
			icNumber: extracted.documentNumber || extracted.document_number || reply.documentNumber || "",
			dateOfBirth: normalizeDate(extracted.dateOfBirth || extracted.date_of_birth || extracted.dob || reply.dateOfBirth),
			gender: mapGender(extracted.sex || extracted.gender || reply.sex),
			nationality: extracted.nationality || reply.nationality || "",
			dateOfExpiry: normalizeDate(extracted.dateOfExpiry || extracted.date_of_expiry || reply.dateOfExpiry),
			issuingCountry: extracted.issuingCountry || extracted.issuing_country || "",
			issuingState: extracted.issuingState || extracted.issuing_state || "",
			personalNumber: extracted.personalNumber || extracted.personal_number || "",
			finalCheckDigit: extracted.finalCheckDigit || extracted.finalcheckDigit || "",
			religion: extracted.religion || "",
			race: extracted.race || extracted.descendants || "",
			address: addressText || "",
			postcode: extractPostcode(extracted.postcode || addressText || reply.fullAddress || reply.address),
			state: detectStateKey(extracted.state || extracted.issuingState || addressText),
		};

		return NextResponse.json(mapped);
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
