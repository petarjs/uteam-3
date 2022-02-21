import createAxios from './http';
import {getProfileById } from './profile'

export const addNewQuestion = async ({ text, type, order, company }) => {
  try {
    const response = await createAxios.post('/api/questions', {
      data: {
        text,
        type,
        order,
        company
      }
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getQuestions = async () => {
  try {
    const response = await createAxios.get('/api/questions',{
      params:{
        'pagination[pageSize]':1000
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteQuestions = async (idQuestion) => {
  try {
    await createAxios.delete(`api/questions/${idQuestion}`);
  } catch (error) {
    console.log(error);
  }
};

export const getQuestionsByCompanyID = async () => {
  try {
    const responseUser = await createAxios.get("/api/users/me");
    const responseProfile = await getProfileById(responseUser.data.id);
    const companyID = responseProfile.data.data[0].attributes.company.data.id;
    const response = createAxios.get('api/questions/', {
      params: {
        'filters[company][id][$eq]': companyID,
        populate: ['company', 'answers'],
        'pagination[pageSize]':1000
      }
    });
    return response;
  } catch (error) {
    console.log('An error occurred:', error.response);
  }
};
