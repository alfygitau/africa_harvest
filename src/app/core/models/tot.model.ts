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
  email: string | null;
  gender: string;
  msisdn: string;
  userId: number;
  wardId: number;
  countyId: number;
  idNumber: string;
  isActive: number;
  lastName: string;
  username: string;
  createdAt: string;
  firstName: string;
  updatedAt: string;
  wardTitle: string;
  userTypeId: number;
  countyTitle: string;
  subCountyId: number;
  subCountyTitle: string;
}
