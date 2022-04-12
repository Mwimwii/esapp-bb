import {
  Farmer,
} from 'app/models';
import { FarmerAPI } from 'app/types';

export class FarmerService {
  async getAll() {
    const farmers = await Farmer.createQueryBuilder('farmer').getMany()
    return farmers
  }

  async add(
    data: FarmerAPI,
  ) {
    const {
  firstName,
  otherNames,
  lastName,
  sex,
  dob,
  nrc,
  maritalStatus,
  contactNumber,
  relationshipToHouseholdHead,
  registrationDate,
  status,
  householdSize,
  village,
  chiefdom,
  block,
  zone,
  commodity,
  title,
  householdHeadType,
  latitude,
  longitude
            } = data;

    const farmer = new Farmer();

    farmer.firstName = firstName;
    farmer.otherNames = otherNames;
    farmer.lastName = lastName;
    farmer.sex = sex;
    farmer.dob = dob;
    farmer.nrc = nrc;
    farmer.maritalStatus = maritalStatus
    farmer.contactNumber = contactNumber
    farmer.relationshipToHouseholdHead = relationshipToHouseholdHead
    farmer.registrationDate = registrationDate
    farmer.status = status
    farmer.householdSize = householdSize
    farmer.village = village
    farmer.chiefdom = chiefdom
    farmer.block = block
    farmer.zone = zone
    farmer.commodity = commodity
    farmer.title = title
    farmer.householdHeadType = householdHeadType
    farmer.latitude = latitude
    farmer.longitude = longitude

    await farmer.save();

    return farmer;
  }


  async import () {

  }

}

