import { Ward } from './ward.model';

export interface SubCounty {
  subCountyId: number;
  name: string;
  wards: Ward[];
}

export interface NewSubCounty {
  title: string;
  county_id: number;
  sub_county_id: number;
}
