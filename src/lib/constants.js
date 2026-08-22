// 8 Administrative Divisions of Bangladesh
export const BANGLADESH_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];

// 64 Districts Mapped by Division in Bangladesh
export const DIVISION_DISTRICTS_MAP = {
  Dhaka: [
    "Dhaka",
    "Gazipur",
    "Narayanganj",
    "Narsingdi",
    "Tangail",
    "Manikganj",
    "Munshiganj",
    "Faridpur",
    "Gopalganj",
    "Madaripur",
    "Rajbari",
    "Shariatpur",
    "Kishoreganj",
  ],
  Chattogram: [
    "Chattogram",
    "Cox's Bazar",
    "Cumilla",
    "Feni",
    "Brahmanbaria",
    "Noakhali",
    "Chandpur",
    "Lakshmipur",
    "Khagrachhari",
    "Rangamati",
    "Bandarban",
  ],
  Sylhet: [
    "Sylhet",
    "Moulvibazar",
    "Habiganj",
    "Sunamganj",
  ],
  Rajshahi: [
    "Rajshahi",
    "Bogura",
    "Pabna",
    "Sirajganj",
    "Naogaon",
    "Natore",
    "Chapainawabganj",
    "Joypurhat",
  ],
  Khulna: [
    "Khulna",
    "Jashore",
    "Kushtia",
    "Satkhira",
    "Bagerhat",
    "Jhenaidah",
    "Chuadanga",
    "Magura",
    "Meherpur",
    "Narail",
  ],
  Barishal: [
    "Barishal",
    "Bhola",
    "Patuakhali",
    "Pirojpur",
    "Barguna",
    "Jhalokati",
  ],
  Rangpur: [
    "Rangpur",
    "Dinajpur",
    "Kurigram",
    "Gaibandha",
    "Nilphamari",
    "Lalmonirhat",
    "Thakurgaon",
    "Panchagarh",
  ],
  Mymensingh: [
    "Mymensingh",
    "Jamalpur",
    "Netrokona",
    "Sherpur",
  ],
};

// All 64 Districts Flattened List
export const ALL_BANGLADESH_DISTRICTS = Object.values(DIVISION_DISTRICTS_MAP).flat();

// Top 10 Major Cities / Metropolitan Areas in Bangladesh
export const TOP_CITIES_BD = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Gazipur",
];
