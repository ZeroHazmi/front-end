"use server";

import {cookies} from "next/headers";
import {use} from "react";

export async function setCookie(cookieName: string, token: string) {
	(await cookies()).set(cookieName, token);
}

export async function removeCookie(cookieName: string) {
	(await cookies()).delete(cookieName);
}

export async function getCookie(name: string) {
	const token = (await cookies()).get(name); // Get the cookie value by name
	return token ? token.value : ""; // Return cookie value or an empty string if not found
}

export async function decodeToken(token: string) {
	try {
		// Validate that the token has three parts
		if (!token || token.split(".").length !== 3) {
			throw new Error("Invalid token format");
		}

		// Split the token into its three parts
		const parts = token.split(".");
		const payloadBase64 = parts[1]; // The second part is the payload

		// Decode the Base64-encoded payload
		const payloadBuffer = Buffer.from(payloadBase64, "base64");
		const payloadJson = payloadBuffer.toString("utf8");

		// Parse the payload JSON
		const payload = JSON.parse(payloadJson);

		console.log("Decoded payload:", payload);

		return payload; // Return the decoded token payload
	} catch (error) {
		console.error("Invalid token:", error);
		return null; // Return null if decoding fails
	}
}
