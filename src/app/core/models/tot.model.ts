export interface Tot {
  createAt: string;
  dob: string;
  email: string;
  firstName: string;
  gender: string;
  idNumber: string;
  isActive: number;
  lastName: string;
  msisdn: string;
  updatedAt: string;
  userId: number;
  userTypeId: number;
  username: string;
  ward_id: number;
}

export interface Trainer {
  dob: string;
  gender: string;
  is_tot: boolean;
  msisdn: string;
  ward_id: number;
  group_id: number;
  county_id: number;
  id_number: string;
  last_name: string;
  member_id: number;
  ward_name: string;
  first_name: string;
  is_disabled: string;
  county_title: string;
  sub_county_id: number;
  sub_county_title: string;
  email: string;
}
