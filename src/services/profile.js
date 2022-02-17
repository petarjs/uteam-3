import createAxios from './http';

export const createNewProfile = async (userId, photoId, nameProfile, companyId) => {
  try {
    const response = await createAxios.post('/api/profiles', {
      data: {
        user: userId,
        company: companyId,
        profilePhoto: photoId,
        name: nameProfile,
        status: 'pending'
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

export const changeName = async (name) => {
  try {
    const responseUser = await createAxios.get('/api/users/me');
    const responseGetName = await getProfileById(responseUser.data.id);
    const idProfile = responseGetName.data.data[0].id;
    const response = await createAxios.put(`/api/profiles/${idProfile}`, {
      data: { name }
    });
    return response;
  } catch (error) {
    console.log('An error occurred:', error.response);
  }
};

export const changeProfilePhoto = async (photoId) => {
  try {
    const responseUser = await createAxios.get('/api/users/me');
    const responseGetName = await getProfileById(responseUser.data.id);
    const idProfile = responseGetName.data.data[0].id;

    const response = await createAxios.put(`/api/profiles/${idProfile}`, {
      data: {
        profilePhoto: photoId
      }
    });
    return response;
  } catch (error) {
    console.log('An error occurred:', error.response);
  }
};

export const getProfilesForCompany = async () => {
  try {
    const responseUser = await createAxios.get('/api/users/me');
    const responseProfile = await getProfileById(responseUser.data.id);
    const idCompany = responseProfile.data.data[0].attributes.company.data.id;
    const response = await createAxios.get('/api/profiles/', {
      params: {
        'filters[company][id][$eq]': idCompany,
        populate: ['profilePhoto', 'company']
      }
    });
    return response.data;
  } catch (error) {
    console.log('An error occurred:', error.response);
  }
};