import createAxios from './http';

export const postAnswers = async ({ question, profile, answer }) => {
  try {
    const response = await createAxios.post('/api/answers', {
      data: {
        question,
        profile,
        answer
      }
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getAnswers = async () => {
    try {
      const response = await createAxios.get('/api/answers');
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
