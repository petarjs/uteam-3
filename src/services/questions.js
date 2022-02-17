import createAxios from './http';

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
    const response = await createAxios.get('/api/questions');
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
