import createAxios from './http';

export const getQuestions = async (companyId) => {
  try {
    const response = createAxios.get('api/questions/', {
      params: {
        'filters[company][id][$eq]': companyId,
        populate: ['company']
      }
    });
    return response;
  } catch (error) {
    console.log('An error occurred:', error.response);
  }
};

export const DeleteQuestionById = async (id, dataForSubmit) => {
  try {
    const response = createAxios.put('api/questions/' + id, { data: { text: dataForSubmit } });
    return response;
  } catch (error) {
    console.log('An error occurred:', error.response);
  }
};
