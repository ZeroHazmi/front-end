import { AppUser } from '@/types/index.d';

const BASE_URL = 'http://localhost:5035/api/';

export async function login(username: string, password: string) {
	const response = await fetch(`${BASE_URL}user/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ username, password }),
	});

	if (response.status === 401) {
		throw new Error('Invalid username or password.');
	}

	if (!response.ok) {
		const errorResponse = await response.json();
		// Include the error message from the API response if available
		throw new Error(
			errorResponse?.message || 'Login failed. Please try again.',
		);
	}

	return await response.json();
}

export async function registerUser(registerData: AppUser): Promise<any> {
	const response = await fetch('http://localhost:5035/api/user/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(registerData),
	});

	if (!response.ok) {
		const errorResponse = await response.json();
		throw new Error(errorResponse.title || 'Registration failed');
	}

	return response.json();
}
