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
			name: z.string().min(1, {message: "Name is required."}),
			email: z.string().email({message: "Invalid email address."}),
			icNumber: z.string().min(1, {message: "IC Number is required."}),
			// Birthday field without refine validation
			birthday: z.string().min(10, {message: "Birthdate is required"}),
			gender: z.string().min(1, {message: "Gender is required."}),
			nationality: z
				.string()
				.min(1, {message: "Nationality is required."}),
			descendants: z
				.string()
				.min(1, {message: "Descendants information is required."}),
			religion: z.string().min(1, {message: "Religion is required."}),
			phoneNumber: z.string().min(10, {
				message: "Phone number must be at least 10 digits.",
			}),
			housePhoneNumber: z.string().optional(),
			officePhoneNumber: z.string().optional(),
			address: z.string().min(5, {
				message: "Address must be at least 5 characters long.",
			}),
			postcode: z
				.string()
				.min(5, {
					message: "Postcode must be at least 5 characters long.",
				})
				.max(10, {
					message: "Postcode must be at most 10 characters long.",
				}),
			region: z.string().min(1, {message: "Region is required."}),
			state: z.string().min(1, {message: "State is required."}),
			repassword: z.string().optional(),
		})
		.refine(schema => {
			if (schema.password !== schema.repassword) {
				toast({
					variant: "destructive",
					description: "Password do not match",
				});
			}
			return true;
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
			name: z.string().min(1, {message: "Name is required."}),
			email: z.string().email({message: "Invalid email address."}),
			icNumber: z.string().min(1, {message: "IC Number is required."}),
			gender: z.string().min(1, {message: "Gender is required."}),
			repassword: z.string().optional(),
			phoneNumber: z.string().min(10, {
				message: "Phone number must be at least 10 digits.",
			}),
		})
		.refine(schema => {
			if (schema.password !== schema.repassword) {
				toast({
					variant: "destructive",
					description: "Password do not match",
				});
			}
			return true;
		});
};

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
