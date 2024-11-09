import { toast } from '@/hooks/use-toast';
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
} from '@/types/constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const loginFormSchema = () =>
	z.object({
		username: z.string().min(1, { message: 'Username is required.' }),
		password: z.string().min(1, { message: 'Password is required.' }),
	});

export const signUpFormSchema = () => {
	const today = new Date();
	const ageLimit = 18;
	const email = z.string().email();

	return z
		.object({
			username: z
				.string()
				.min(3, {
					message: 'Username must be at least 3 characters long.',
				})
				.max(20, {
					message: 'Username must be at most 20 characters long.',
				}),
			email: z.string().email({ message: 'Invalid email address.' }),
			reemail: z.string().email().optional(),
			phoneNumber: z.string().min(10, {
				message: 'Phone number must be at least 10 digits.',
			}),
			password: z
				.string()
				.min(8, {
					message: 'Password must be at least 8 characters long.',
				})
				.max(20, {
					message: 'Password must be at most 20 characters long.',
				}),
			repassword: z.string().optional(),
			icNumber: z.string().min(1, { message: 'IC Number is required.' }),
			birthday: z
				.string()
				.min(10, { message: 'Birthdate is required' })
				.refine(
					(dateString) => {
						const parts = dateString.split('/');
						if (parts.length !== 3) return false; // Ensure there are 3 parts

						const [day, month, year] = parts.map(Number);
						if (isNaN(day) || isNaN(month) || isNaN(year))
							return false; // Validate numbers

						// Create a date object, note month is zero-indexed
						const date = new Date(year, month - 1, day);
						// Check if the date is valid
						if (
							date.getDate() !== day ||
							date.getMonth() + 1 !== month ||
							date.getFullYear() !== year
						) {
							return false; // Invalid date
						}

						const age = today.getFullYear() - date.getFullYear();
						const monthDiff = today.getMonth() - date.getMonth();
						// Check if the user is 18 years or older
						return (
							age > ageLimit ||
							(age === ageLimit && monthDiff > 0) ||
							(age === ageLimit &&
								monthDiff === 0 &&
								today.getDate() >= date.getDate())
						);
					},
					{
						message: 'You must be at least 18 years old.',
					},
				),
			gender: z.string().min(1, { message: 'Gender is required.' }),
			nationality: z
				.string()
				.min(1, { message: 'Nationality is required.' }),
			descendants: z
				.string()
				.min(1, { message: 'Descendants information is required.' }),
			religion: z.string().min(1, { message: 'Religion is required.' }),
			housePhoneNumber: z.string().optional(),
			officePhoneNumber: z.string().optional(),
			address: z.string().min(5, {
				message: 'Address must be at least 5 characters long.',
			}),
			postcode: z
				.string()
				.min(5, {
					message: 'Postcode must be at least 5 characters long.',
				})
				.max(10, {
					message: 'Postcode must be at most 10 characters long.',
				}),
			region: z.string().min(1, { message: 'Region is required.' }),
			state: z.string().min(1, { message: 'State is required.' }),
		})
		.refine((schema) => {
			if (schema.email !== schema.reemail) {
				toast({
					variant: 'destructive',
					description: 'Email do not match',
				});
			}
			if (schema.password !== schema.repassword) {
				toast({
					variant: 'destructive',
					description: 'Password do not match',
				});
			}
			return true;
		});
};

export const getDistricts = (state: string) => {
	switch (state) {
		case 'johor':
			return johorDistricts;
		case 'kedah':
			return kedahDistricts;
		case 'kelantan':
			return kelantanDistricts;
		case 'melaka':
			return melakaDistricts;
		case 'negeriSembilan':
			return negeriSembilanDistricts;
		case 'pahang':
			return pahangDistricts;
		case 'penang':
			return penangDistricts;
		case 'perak':
			return perakDistricts;
		case 'perlis':
			return perlisDistricts;
		case 'selangor':
			return selangorDistricts;
		case 'terengganu':
			return terengganuDistricts;
		case 'sabah':
			return sabahDistricts;
		case 'sarawak':
			return sarawakDistricts;
		case 'kualaLumpur':
			return kualaLumpurDistricts;
		case 'putrajaya':
			return [];
		case 'labuan':
			return [];
		default:
			return [];
	}
};
