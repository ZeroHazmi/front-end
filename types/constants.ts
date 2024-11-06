// States with their identifiers
export const states = {
	johor: 'Johor',
	kedah: 'Kedah',
	kelantan: 'Kelantan',
	melaka: 'Melaka',
	negeriSembilan: 'Negeri Sembilan',
	pahang: 'Pahang',
	penang: 'Penang',
	perak: 'Perak',
	perlis: 'Perlis',
	selangor: 'Selangor',
	terengganu: 'Terengganu',
	sabah: 'Sabah',
	sarawak: 'Sarawak',
	kualaLumpur: 'Kuala Lumpur',
	putrajaya: 'Putrajaya',
	labuan: 'Labuan',
};

// Now you can use `states` and `districts` objects independently
export const johorDistricts = [
	'Johor Bahru',
	'Kota Tinggi',
	'Batu Pahat',
	'Kluang',
	'Mersing',
	'Segamat',
	'Pontian',
	'Tangkak',
	'Kulai',
	'Pengerang',
];

export const kedahDistricts = [
	'Alor Setar',
	'Kota Setar',
	'Kulim',
	'Baling',
	'Langkawi',
	'Pendang',
	'Pangkalan Kundur',
	'Pokok Sena',
	'Sungai Petani',
	'Kuala Kedah',
];

export const kelantanDistricts = [
	'Kota Bharu',
	'Bachok',
	'Tumpat',
	'Pasir Mas',
	'Tanah Merah',
	'Machang',
	'Jeli',
	'Gua Musang',
	'Kuala Krai',
];

export const melakaDistricts = ['Melaka Tengah', 'Alor Gajah', 'Jasin'];

export const negeriSembilanDistricts = [
	'Seremban',
	'Port Dickson',
	'Nilai',
	'Jempol',
	'Kuala Pilah',
	'Rembau',
	'Tampin',
];

export const pahangDistricts = [
	'Kuantan',
	'Temerloh',
	'Bentong',
	'Raub',
	'Pekan',
	'Lipis',
	'Cameron Highlands',
	'Jerantut',
	'Bera',
	'Maran',
];

export const penangDistricts = [
	'George Town',
	'Butterworth',
	'Bayan Lepas',
	'Nibong Tebal',
	'Seberang Perai Utara',
	'Seberang Perai Tengah',
	'Seberang Perai Selatan',
];

export const perakDistricts = [
	'Ipoh',
	'Taiping',
	'Kuala Kangsar',
	'Sitiawan',
	'Lumut',
	'Batu Gajah',
	'Teluk Intan',
	'Gerik',
	'Parit Buntar',
	'Langkap',
];

export const perlisDistricts = [
	'Kangar',
	'Arau',
	'Beseri',
	'Padang Besar',
	'Kuala Perlis',
];

export const selangorDistricts = [
	'Shah Alam',
	'Petaling Jaya',
	'Subang Jaya',
	'Sungai Buloh',
	'Klang',
	'Sepang',
	'Kuala Langat',
	'Hulu Selangor',
	'Sabak Bernam',
];

export const terengganuDistricts = [
	'Kuala Terengganu',
	'Dungun',
	'Kemaman',
	'Marang',
	'Setiu',
	'Besut',
	'Hulu Terengganu',
];

export const sabahDistricts = [
	'Kota Kinabalu',
	'Sandakan',
	'Tawau',
	'Kudat',
	'Lahad Datu',
	'Putatan',
	'Penampang',
	'Ranau',
	'Semporna',
	'Beluran',
];

export const sarawakDistricts = [
	'Kuching',
	'Samarahan',
	'Sibu',
	'Bintulu',
	'Miri',
	'Lundu',
	'Kapit',
	'Mukah',
	'Sri Aman',
];

export const kualaLumpurDistricts = [
	'Batu',
	'Cheras',
	'Kepong',
	'Lembah Pantai',
	'Segambut',
	'Titiwangsa',
	'Wangsa Maju',
];

// Define the stateDistrictsMap with references to the district arrays
export const stateDistrictsMap = {
	johor: { districts: johorDistricts },
	kedah: { districts: kedahDistricts },
	kelantan: { districts: kelantanDistricts },
	melaka: { districts: melakaDistricts },
	negeriSembilan: { districts: negeriSembilanDistricts },
	pahang: { districts: pahangDistricts },
	penang: { districts: penangDistricts },
	perak: { districts: perakDistricts },
	perlis: { districts: perlisDistricts },
	selangor: { districts: selangorDistricts },
	terengganu: { districts: terengganuDistricts },
	sabah: { districts: sabahDistricts },
	sarawak: { districts: sarawakDistricts },
	kualaLumpur: { districts: kualaLumpurDistricts },
	putrajaya: { districts: [] },
	labuan: { districts: [] },
};

export const races = {
	Malay: 'Malay',
	Chinese: 'Chinese',
	Indian: 'Indian',
	Others: 'Others',
};

export const religion = {
	Islam: 'Islam',
	Buddhism: 'Buddhism',
	Christianity: 'Christianity',
	Hinduism: 'Hinduism',
	Others: 'Others',
};

export const nationality = {
	Malaysian: 'Malaysian',
	PermenantResident: 'Permanent Resident',
};

export const descendants = {
	Malay: 'Malay',
	Chinese: 'Chinese',
	Indian: 'Indian',
	Others: 'Others',
};

export const gender = {
	male: 'Male',
	female: 'Female',
};
