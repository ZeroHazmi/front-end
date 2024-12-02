export type LatLng = {
	lat: number;
	lng: number;
};

export type UpdateLocationParams = {
	address: string;
	gpscoords: LatLng;
};

export enum MapAddressType {
	PARKINGLOCATION = "PARKINGLOCATION",
	DESTINATION = "DESTINATION",
	ADMIN = "ADMIN",
}

export type MapParams = {
	id: string;
	gpscoords: LatLng;
	address: string;
	type?: string;
	status?: string;
	radius?: number;
};

export type ActionResponse = {
	code: number;
	message: string;
	data?: any;
	error?: any;
};

export type User = {
	id: string;
	username: string;
	name: string;
	icNumber: string;
	email: string;
	age: number;
	gender: string;
};
