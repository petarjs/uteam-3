import createAxios from './http';
import { getProfileById } from "./profile";

export const createCompany = async (company) => {
  try {
    const response = await createAxios.post('/api/companies', {
      data: {
        name: `${company}`
      }
    });
    return response;
  } catch (error) {
    console.log('An error occurred:', error.response);
  }
};

export const getCompanies = async () => {
  try {
    const response = await createAxios.get("/api/companies");
    return response.data;
  } catch (error) {
    console.log("An error occurred:", error.response);
  }
};

export const getCompanyById = async () => {
  try {
    const responseUser = await createAxios.get("/api/users/me");
    const responseProfile = await getProfileById(responseUser.data.id);
    const companyID = responseProfile.data.data[0].attributes.company.data.id;
    const response = await createAxios.get(`/api/companies/${companyID}`);
    return response.data;
  } catch (error) {
    console.log("An error occurred:", error.response);
  }
};
