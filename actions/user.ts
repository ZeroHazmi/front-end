import {AppUser} from "@/types";

export async function login(icNumber: string, password: string) {
	console.log(`Attempting login to ${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}user/login with icNumber`);
	const response = await fetch(`${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}user/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ icNumber, password }),
	});

	console.log("Login request sent to:", `${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}user/login`);
	console.log("Response status:", response.status, response.statusText);

	if (response.status === 401) {
		throw new Error("Invalid username or password.");
	}

	if (!response.ok) {
		// Try to read response body (text) for richer error details
		let bodyText = "";
		try {
			bodyText = await response.text();
			console.error("Login API response body:", bodyText);
		} catch (err) {
			console.error("Failed to read response body", err);
		}

		// Attempt to parse JSON message if present
		try {
			const errorResponse = JSON.parse(bodyText || "{}");
			throw new Error(errorResponse?.message || bodyText || "Login failed. Please try again.");
		} catch (parseErr) {
			// Not JSON, throw with raw body text or generic message
			throw new Error(bodyText || "Login failed. Please try again.");
		}
	}

	return await response.json();
}

export async function registerUser(registerData: AppUser) {
	try {

		console.log("📤 Sending registration data:", registerData);

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}user/register`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(registerData),
			}
		);

		// Read the raw response text (not parsed yet)
		const rawText = await response.text();

		// Log everything to inspect what the server actually sent
		console.group("📦 Azure Register API Response");
		console.log("➡️ Status:", response.status);
		console.log("➡️ Status Text:", response.statusText);
		console.log("➡️ URL:", response.url);
		console.log("➡️ Raw Response:", rawText);
		console.groupEnd();

		if (!response.ok) {
			// Attempt to parse rawText as JSON for detailed server validation errors
			let parsed: any = null;
			try {
				parsed = JSON.parse(rawText);
			} catch (_) {
				/* not JSON */
			}

			// Many APIs return validation errors in an 'errors' object
			const errorMessage = parsed?.message || parsed?.errors || rawText || "Registration failed. Please try again.";
			// If it's an errors object, stringify it for display
			const messageToThrow = typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage;
			throw new Error(messageToThrow);
		}

		// Parse and return JSON result
		try {
			return JSON.parse(rawText);
		} catch (e) {
			// If parsing fails but response was ok, return raw text
			return rawText as any;
		}
	} catch (error: any) {
		// Handle fetch errors (e.g., network issues)
		const errorMessage = error.message || "An unknown error occurred.";
		throw new Error(errorMessage);
	}
}

