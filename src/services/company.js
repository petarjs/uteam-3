import createAxios from './http';

export const createCompany = async (company) => {
  try {
    const response = await createAxios.post('/api/companies', {
      data: {
        name: `${company}'s Company`
      }
    });
    return response;
  } catch (error) {
    console.log('An error occurred:', error.response);
  }
};
