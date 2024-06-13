export class User {
  id?: number;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  email?: string;
}

export interface UserInfo {
  dob: string;
  email: string;
  gender: string;
  msisdn: string;
  userId: number;
  ward_id: number;
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
  subcountyTitle: string;
}
