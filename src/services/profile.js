import createAxios from './http';
export const createNewProfile = async (userId, photoId, companyId) => {
  try {
    const response = await createAxios.post('/api/profiles', {
      data: {
        user: userId,
        company: companyId,
        profilePhoto: photoId
      }
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getProfileById = async (userId) => {
  try {
    const response = await createAxios.get(`/api/profiles/`, {
      params: {
        'filters[user][id][$eq]': userId,
        populate: ['profilePhoto', 'company']
      }
    });
    return response;
  } catch (error) {
    console.log('An error occurred:', error.response);
  }
};
