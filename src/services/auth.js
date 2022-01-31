import createAxios from './http';

export const login = async ({ email, password }) => {
  try {
    const response = await createAxios.post('/api/auth/local', {
      identifier: email,
      password: password
    });
    return response;
  } catch (error) {
    console.log('An error occurred:', error.response);
  }
};

export const register = async ({ name, email, password }) => {
  return createAxios.post('/api/auth/local/register', {
    username: name,
    email: email,
    password: password
  });
};
