import { NewSubCounty, SubCounty } from './subCounty.model';

export interface County {
  county_id: number;
  name: string;
  sub_counties: SubCounty[];
}
export interface SuperSubCounty {
  county_id: number;
  name: string;
  sub_counties: NewSubCounty[];
}

export interface NewCounty {
  title: string;
  county_id: number;
}
