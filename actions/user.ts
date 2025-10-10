import {AppUser} from "@/types/index.d";

export async function login(username: string, password: string) {
	// The backend expects an 'icNumber' field. Use the provided username value
	// as icNumber so both username-based and icNumber-based callers work.
	const url = `${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}user/login`;
	console.log(url);

	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ icNumber: username, password }),
	});

	console.log("Login request sent to:", url);
	console.log("Response status:", response.status, response.statusText);

	if (response.status === 401) {
		throw new Error("Invalid username or password.");
	}

	if (!response.ok) {
		// Try to read response body for richer error details
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
			throw new Error(bodyText || "Login failed. Please try again.");
		}
	}

	return await response.json();
}

export async function registerUser(registerData: AppUser) {
	try {
		const base = process.env.NEXT_PUBLIC_PRAS_API_BASE_URL
		if (!base) {
			console.error('[registerUser] NEXT_PUBLIC_PRAS_API_BASE_URL is not set')
			throw new Error('Server configuration missing: NEXT_PUBLIC_PRAS_API_BASE_URL')
		}
		const response = await fetch(
			`${base}user/register`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(registerData),
			}
		);

		const text = await response.text().catch(() => '')
		let jsonBody: any = null
		try { jsonBody = text ? JSON.parse(text) : null } catch (e) { jsonBody = null }

		if (!response.ok) {
			console.error('[registerUser] API error', response.status, response.statusText, jsonBody || text)
			const errorMessage = jsonBody?.message || jsonBody?.error || text || `Registration failed (${response.status})`
			throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage))
		}

		try {
			return jsonBody || JSON.parse(text || '{}')
		} catch (e) {
			return text
		}
	} catch (error: any) {
		// Handle fetch errors (e.g., network issues)
		const errorMessage = error.message || "An unknown error occurred.";
		throw new Error(errorMessage);
	}
}
