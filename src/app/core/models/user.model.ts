export interface NewUser {
  firstName: string;
  lastName: string;
  gender: string;
  idNumber: string;
  dob: string;
  email: string;
  msisdn: string;
  username: string;
  password: string;
  userTypeId: number;
  wardId: number;
}

export interface Farmer {
  dob: string; // Date of birth in the format YYYY-MM-DD
  gender: 'MALE' | 'FEMALE'; // Gender can be either "MALE" or "FEMALE"
  is_tot: boolean | null; // This field can be either a boolean or null
  msisdn: string; // Mobile phone number
  ward_id: number; // ID of the ward
  group_id: number; // ID of the group
  county_id: number; // ID of the county
  id_number: string; // ID number of the farmer
  last_name: string; // Last name of the farmer
  member_id: number; // Member ID
  ward_name: string; // Name of the ward
  first_name: string; // First name of the farmer
  is_disabled: 'TRUE' | 'FALSE'; // Disability status as a string "TRUE" or "FALSE"
  county_title: string; // Title of the county
  sub_county_id: number; // ID of the sub-county
  sub_county_title: string; // Title of the sub-county
}

export interface City {
  name: string,
  code: string
}
