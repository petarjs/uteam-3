import createAxios from './http';
import { getProfileById } from "./profile"

export const postAnswers = async ({ question, profile, answer }) => {
  try {
    console.log(question, profile, answer)
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
export const putAnswers = async ({ question, profile, answer }, answerID) => {
  try {
    console.log(question, profile, answer)
    const response = await createAxios.put(`/api/answers/${answerID}`, {
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
    const responseUser = await createAxios.get("/api/users/me");
    const responseProfile = await getProfileById(responseUser.data.id);
    const profileID = responseProfile.data.data[0].id
    const response = await createAxios.get('/api/answers',{
      // params:{
      //   'pagination[pageSize]':1000
      // }
      params: {
        'filters[profile][id][$eq]': profileID,
        populate: ['question', 'profile'],
        'pagination[pageSize]':1000

      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};