
export interface MarketPriceAPI {
  id: number;
  price: number;
  unit: string;
  commodity_type: string;
  market: string;
  price_level: string;
}


export interface FaabsAttendanceAPI {
  id: number;
  faabsGroup: FaabsAPI;
  farmers: FarmerAPI[];
  topic: FaabsTopicAPI;
  facilitators: string;
  partnerOrgrganisations: string;
  trainingDate: string;
  duration: number;
  quarter: number;
  trainingType: string;
}

export interface FaabsTopicAPI {
  title: string;
  outputLevelIndicator: string;
  category: string;
  subComponent: string;
}

export interface FarmerAPI {
  id: number;
  faabsGroup: FaabsAPI;
  firstName: string;
  otherNames: string;
  lastName: string;
  sex: string;
  dob: string;
  nrc: string;
  maritalStatus: string;
  contactNumber: string;
  relationshipToHouseholdHead: string;
  registrationDate: string;
  status: number;
  householdSize: number;
  village: string;
  chiefdom: string;
  block: string;
  zone: string;
  commodity: string;
  title: string;
  householdHeadType: string;
  latitude: number;
  longitude: number;
  uuid: string;
}

export interface UserAPI {
    email: string;
    camp_officer: CampOfficerAPI;
}

export interface CampOfficerAPI {
  empId: string;
  firstName: string;
  lastName: string;
  uuid: string;
  user: UserAPI;
  camp: CampAPI;
}

export interface FaabsAPI {
  id: number;
  name: string;
  description: string;
  camp: CampAPI;
  farmers: FarmerAPI[];
  longitude: number;
  latitude: number;
  status: number;
  maxAttendedTopics: number;
  topics: FaabsTopicAPI[];
  attendance: FaabsAttendanceAPI[];
  uuid: string;
}

export interface CampAPI {
  id: number;
  name: string;
  description: string;
  district: DistrictAPI;
  faabs: FaabsAPI[];
  camp_officers: CampOfficerAPI[];
  uuid: string;
  longitude: number;
  latitude: number;
}

export interface DistrictAPI {
  id: number;
  name: string;
  code: string;
  province: ProvinceAPI;
  camps: CampAPI[];
  longitude: number;
  latitude: number;
}

export interface ProvinceAPI {
  id: number;
  name: string;
  code: string;
  districts: DistrictAPI[];
  longitude: number;
  latitude: number;
}