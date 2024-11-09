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
	return z
		.object({
			userName: z
				.string()
				.min(3, {
					message: 'Username must be at least 3 characters long.',
				})
				.max(20, {
					message: 'Username must be at most 20 characters long.',
				}),
			password: z
				.string()
				.min(8, {
					message: 'Password must be at least 8 characters long.',
				})
				.max(20, {
					message: 'Password must be at most 20 characters long.',
				}),
			email: z.string().email({ message: 'Invalid email address.' }),
			icNumber: z.string().min(1, { message: 'IC Number is required.' }),
			// Birthday field without refine validation
			birthday: z.string().min(10, { message: 'Birthdate is required' }),
			gender: z.string().min(1, { message: 'Gender is required.' }),
			nationality: z
				.string()
				.min(1, { message: 'Nationality is required.' }),
			descendants: z
				.string()
				.min(1, { message: 'Descendants information is required.' }),
			religion: z.string().min(1, { message: 'Religion is required.' }),
			phoneNumber: z.string().min(10, {
				message: 'Phone number must be at least 10 digits.',
			}),
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
			repassword: z.string().optional(),
		})
		.refine((schema) => {
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
