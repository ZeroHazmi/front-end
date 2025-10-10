import {toast} from "@/hooks/use-toast";
import {
	johorDistricts,
	kedahDistricts,
	kelantanDistricts,
	kualaLumpurDistricts,
	melakaDistricts,
	negeriSembilanDistricts,
	pahangDistricts,
	penangDistricts,
	perakDistricts,
	perlisDistricts,
	sabahDistricts,
	sarawakDistricts,
	selangorDistricts,
	terengganuDistricts,
} from "@/types/constants";
import {Library} from "@googlemaps/js-api-loader";
import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";
import {z} from "zod";
import {format} from "date-fns";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const libs: Library[] = ["core", "maps", "places", "marker"];

export const loginFormSchema = () =>
	z.object({
		username: z.string().min(1, {message: "Username is required."}),
		password: z.string().min(1, {message: "Password is required."}),
	});

export const signUpFormSchema = () => {
	return z
		.object({
			// Use IC number as primary identifier; no separate username field
			password: z
				.string()
				.min(8, { message: "Password must be at least 8 characters long." })
				.max(20, { message: "Password must be at most 20 characters long." }),
			passwordConfirm: z.string().optional(),
			name: z.string().min(1, { message: "Name is required." }),
			email: z.string().email({ message: "Invalid email address." }),
			emailConfirm: z.string().optional(),
			icNumber: z.string().min(1, { message: "IC Number is required." }),
			// Date of Birth field (expecting YYYY-MM-DD or similar)
			dateOfBirth: z.string().min(1, { message: "Birthdate is required" }),
			gender: z.string().min(1, { message: "Gender is required." }),
			citizenship: z.string().min(1, { message: "Citizenship is required." }),
			race: z.string().min(1, { message: "Race is required." }),
			religion: z.string().min(1, { message: "Religion is required." }),
			mobilePhone: z.string().min(7, { message: "Mobile phone must be at least 7 digits." }),
			mobilePhoneConfirm: z.string().optional(),
			homePhone: z.string().optional(),
			officePhone: z.string().optional(),
			// Support multi-line address fields (RegistrationForm uses address1..address5)
			address1: z.string().min(1, { message: "Address is required." }),
			address2: z.string().optional(),
			address3: z.string().optional(),
			address4: z.string().optional(),
			address5: z.string().optional(),
			postcode: z
				.string()
				.min(3, { message: "Postcode must be at least 3 characters long." })
				.max(10, { message: "Postcode must be at most 10 characters long." }),
			// registration form uses 'district' as the region selector; require district for validation
			district: z.string().min(1, { message: "District is required." }),
			// keep legacy 'region' optional for backward compatibility
			region: z.string().optional(),
			state: z.string().min(1, { message: "State is required." }),
			// (no duplicate district entry)
		})
		.superRefine((data, ctx) => {
			// ensure password match
			if ((data as any).password !== (data as any).passwordConfirm) {
				ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['passwordConfirm'], message: 'Passwords do not match' })
			}

			// ensure email match if provided
			if ((data as any).email !== (data as any).emailConfirm) {
				ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['emailConfirm'], message: 'Emails do not match' })
			}

			// ensure mobile phone match if provided
			if ((data as any).mobilePhone !== (data as any).mobilePhoneConfirm) {
				ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['mobilePhoneConfirm'], message: 'Mobile phone numbers do not match' })
			}

			// check age >= 18 from dateOfBirth (expecting YYYY-MM-DD)
			try {
				const bd = (data as any).dateOfBirth
				if (bd) {
					const d = new Date(bd)
					if (!Number.isNaN(d.getTime())) {
						const today = new Date()
						let age = today.getFullYear() - d.getFullYear()
						const m = today.getMonth() - d.getMonth()
						if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
						if (age < 18) {
							ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['dateOfBirth'], message: 'You must be at least 18 years old' })
						}
					}
				}
			} catch (e) {
				// ignore parsing issues here
			}
		});
};

export const AddPoliceSchema = () => {
	return z
		.object({
			userName: z
				.string()
				.min(3, {
					message: "Username must be at least 3 characters long.",
				})
				.max(20, {
					message: "Username must be at most 20 characters long.",
				}),
			password: z
				.string()
				.min(8, {
					message: "Password must be at least 8 characters long.",
				})
				.max(20, {
					message: "Password must be at most 20 characters long.",
				}),
			name: z.string().min(1, { message: "Name is required." }),
			email: z.string().email({ message: "Invalid email address." }),
			icNumber: z.string().min(1, { message: "IC Number is required." }),
			gender: z.string().min(1, { message: "Gender is required." }),
			repassword: z.string().optional(),
			phoneNumber: z.string().min(10, {
				message: "Phone number must be at least 10 digits.",
			}),
		})
		.refine((schema) => {
			if ((schema as any).password !== (schema as any).repassword) {
				toast({
					variant: "destructive",
					description: "Password do not match",
				})
			}
			return true
		})
}

export const getDistricts = (state: string) => {
	switch (state) {
		case "johor":
			return johorDistricts;
		case "kedah":
			return kedahDistricts;
		case "kelantan":
			return kelantanDistricts;
		case "melaka":
			return melakaDistricts;
		case "negeriSembilan":
			return negeriSembilanDistricts;
		case "pahang":
			return pahangDistricts;
		case "penang":
			return penangDistricts;
		case "perak":
			return perakDistricts;
		case "perlis":
			return perlisDistricts;
		case "selangor":
			return selangorDistricts;
		case "terengganu":
			return terengganuDistricts;
		case "sabah":
			return sabahDistricts;
		case "sarawak":
			return sarawakDistricts;
		case "kualaLumpur":
			return kualaLumpurDistricts;
		case "putrajaya":
			return [];
		case "labuan":
			return [];
		default:
			return [];
	}
};

export const convertBirthdayFormat = (birthday: string): string => {
	// Split the input date (DD-MM-YY) into day, month, and year parts
	const [year, month, day] = birthday.split("-");

	// Determine whether to prepend '20' or '19' based on the value of the year
	const fullYear =
		year.length === 2
			? parseInt(year) < 50
				? `20${year}`
				: `19${year}`
			: year;

	// Return the date in the format DD-MM-YYYY
	return `${day}-${month}-${fullYear}`;
};

export function getStreetFromAddress(address: string) {
	return address.split(",")[0];
}

export function mapStatus(status: number): string {
	const statusMap: Record<number, string> = {
		0: "Open",
		1: "In Progress",
		2: "Closed",
	};
	return statusMap[status] || "Unknown";
}

export function mapPriority(priority: number): string {
	const priorityMap: Record<number, string> = {
		0: "Low",
		1: "Medium",
		2: "High",
		3: "Critical",
	};
	return priorityMap[priority] || "Unknown";
}
