import {NextResponse} from "next/server";
import {cookies} from "next/headers";

// Type definitions
type ReportRequest = {
	userId: string;
	reportTypeID: string;
	reportContent: string;
	reportTypeName: string;
	address: string;
	latitude: number;
	longitude: number;
	state: string;
	date: string;
	time: number;
};

type ReportData = {
	userId?: string;
	icNumber?: string;
	reportTypeId: string;
	status: string;
	priority: string;
	reportDetail: {
		reportTypeId: string;
		date: string;
		time: number;
		address: string;
		latitude: number;
		longitude: number;
		state: string;
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
			userId,
			reportTypeID,
			reportContent,
			reportTypeName,
			address,
			latitude,
			longitude,
			state,
			date,
			time,
		} = body;

		// Get authentication token from cookies
		const cookieStore = await cookies();
		const authToken = cookieStore.get("session");

		if (!authToken) {
			return NextResponse.json(
				{error: "Authentication required"},
				{status: 401}
			);
		}

		// Generate random priority (Low, Medium, High, Critical)
		const priorities = ["Low", "Medium", "High", "Critical"];
		const randomPriority =
			priorities[Math.floor(Math.random() * priorities.length)];

		// Convert the date string to a Date object and get the Unix timestamp (in seconds)
		const dateObj = new Date(date); // Convert string to Date object
		const dateTimestamp = dateObj.toISOString(); // Convert to ISO 8601 format

		// Prepare report data
		const reportData: ReportData = {
			userId: userId,
			reportTypeId: reportTypeID,
			status: "Open",
			priority: randomPriority,
			reportDetail: {
				reportTypeId: reportTypeID,
				date: dateTimestamp,
				time: time,
				address: address,
				latitude: latitude,
				longitude: longitude,
				state: state,
				fieldValue: "{}",
				audio: "",
				image: "",
				transcript: reportContent,
			},
		};

		console.log("Report data:", reportData);

		// Create report in backend API
		const createReportResponse = await fetch(
			`${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}report/create`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json-patch+json",
					Authorization: `Bearer ${authToken.value}`,
				},
				body: JSON.stringify(reportData),
			}
		);

		const contentType = createReportResponse.headers.get("Content-Type");

		if (!createReportResponse.ok) {
			const errorMessage =
				contentType && contentType.includes("application/json")
					? await createReportResponse.json()
					: await createReportResponse.text();
			console.error("Failed to create report:", errorMessage);
			return NextResponse.json(
				{error: "Failed to create report"},
				{status: createReportResponse.status}
			);
		}

		const responseBody =
			contentType && contentType.includes("application/json")
				? await createReportResponse.json()
				: await createReportResponse.text();

		console.log("Response:", responseBody);
		return NextResponse.json(
			{success: true, message: "Report created successfully"},
			{status: 200}
		);
	} catch (error) {
		console.error("Error processing request:", error);
		return NextResponse.json(
			{error: "Internal server error"},
			{status: 500}
		);
	}
}
