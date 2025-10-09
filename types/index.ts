export interface AppUser {
	userName: string;
	// Some backends expect a 'Name' field; keep it optional to allow both shapes
	Name?: string;
	password: string;
	email: string;
	icNumber: string;
	birthday: string; // You can use a date library like moment.js or day.js for Date manipulation.
	gender: string;
	nationality: string;
	descendants: string;
	religion: string;
	phoneNumber: string;
	housePhoneNumber?: string;
	officePhoneNumber?: string;
	address: string;
	postcode: string;
	region: string;
	state: string;
}

export interface Feedback {
	id: number;
	userId: string;
	rating: number;
	comment: string;
	createdAt: Date;
	user: AppUser;
}
export interface Report {
	id: number;
	userId: string;
	reportTypeId: number;
	reportDetailId: number;
	createdAt: Date;
	status: Status;
	priority: Priority;
	appUserId: string;
	appUser: AppUser;
	reportType: ReportType;
	reportDetail: ReportDetail;
}

export interface ReportDetail {
	id: number;
	reportTypeId: number;
	date: Date;
	location: string;
	time: string;
	fieldValue: string; // Store JSON string, parse as needed
	audio: string;
	image: string;
	transcript: string;
	reportType: ReportType;
}

export interface ReportType {
	id: number;
	name: string;
	description: string;
	templateStructure: string; // Store JSON string, parse as needed
}

export enum Gender {
	Male = 'Male',
	Female = 'Female',
}

export enum Priority {
	Low = 'Low',
	Medium = 'Medium',
	High = 'High',
	Critical = 'Critical',
}
export enum Status {
	Open = 'Open',
	InProgress = 'InProgress',
	Completed = 'Completed',
}
export interface TemplateStructure {
	[key: string]: string; // Key-value pairs as strings
}
export interface FieldValue {
	[key: string]: string; // Key-value pairs as strings
}

export interface CustomInput {
	control?: any
	name: string
	label: string
	placeholder: string
	id?: string
}

// interface CustomInput {
// 	control?: Control<z.infer<typeof formSchema>>;
// 	name: FieldPath<z.infer<typeof formSchema>>;
// 	label: string;
// 	placeholder: string;
// 	id?: string;
// }

export interface CustomSelectInput {
	control?: any;
	name: string;
	label: string;
	placeholder?: string;
	options?: Record<string, string> | string[];
		// setValue can be the react-hook-form setValue which accepts multiple args
		setValue?: (...args: any[]) => void;
	id?: string;
}
