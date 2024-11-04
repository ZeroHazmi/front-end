
import { clsx, type ClassValue } from "clsx"
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { twMerge } from "tailwind-merge"
import { z } from "zod"
import { jwtVerify } from 'jose';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function authFormSchema(type: string) {
  if (type === 'sign-in') {
    return z.object({
      username: z.string().min(1, { message: "Username is required." }),
      password: z.string().min(1, { message: "Password is required." }),
    });
  }

  return z.object({
    username: z.string()
      .min(3, { message: "Username must be at least 3 characters long." })
      .max(20, { message: "Username must be at most 20 characters long." }),
    password: z.string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(100, { message: "Password must be at most 100 characters long." }),
    email: z.string()
      .email({ message: "Invalid email address." }),
    icNumber: z.string()
      .min(1, { message: "IC Number is required." }), // Adjust validation as necessary
    birthday: z.string()
      .min(10, { message: "Birthday must be in YYYY-MM-DD format." }), // Add regex if necessary
    gender: z.string()
      .min(1, { message: "Gender is required." }), // Specify gender options if applicable
    nationality: z.string()
      .min(1, { message: "Nationality is required." }),
    descendants: z.string()
      .min(1, { message: "Descendants information is required." }),
    religion: z.string()
      .min(1, { message: "Religion is required." }),
    phoneNumber: z.string()
      .min(10, { message: "Phone number must be at least 10 digits." }),
    housePhoneNumber: z.string().optional(), // Optional if not always provided
    officePhoneNumber: z.string().optional(), // Optional if not always provided
    address: z.string()
      .min(5, { message: "Address must be at least 5 characters long." }),
    postcode: z.string()
      .min(5, { message: "Postcode must be at least 5 characters long." })
      .max(10, { message: "Postcode must be at most 10 characters long." }),
    region: z.string()
      .min(1, { message: "Region is required." }),
    state: z.string()
      .min(1, { message: "State is required." }),
  });
}




