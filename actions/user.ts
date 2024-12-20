import {AppUser} from "@/types/index.d";

export async function login(username: string, password: string) {
	console.log(`${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}user/login`);
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_PRAS_API_BASE_URL}user/login`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({username, password}),
		}
	);

	console.log("Response:", response); // New log

	if (response.status === 401) {
		throw new Error("Invalid username or password.");
	}

	if (!response.ok) {
		const errorResponse = await response.json();
		// Include the error message from the API response if available
		throw new Error(
			errorResponse?.message || "Login failed. Please try again."
		);
	}

	return await response.json();
}

export async function registerUser(registerData: AppUser) {
	try {
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

		if (!response.ok) {
			// Extract error details from the API response
			const errorResponse = await response.json();
			const errorMessage =
				errorResponse?.message ||
				"Registration failed. Please try again.";
			throw new Error(errorMessage);
		}

		return await response.json();
	} catch (error: any) {
		// Handle fetch errors (e.g., network issues)
		const errorMessage = error.message || "An unknown error occurred.";
		throw new Error(errorMessage);
	}
}
