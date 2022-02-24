import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import createAxios from '../services/http';
import { login, register } from '../services/auth';
import { getProfileById, createNewProfile } from '../services/profile';
import { createCompany } from '../services/company';
import { uploadUserPhoto } from '../services/upload';
import { useTeamContext } from '../components/Profile/Team/TeamContextProvider';

const AuthContext = createContext();
const useAuthContext = () => useContext(AuthContext);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPhoto, setUserPhoto] = useState();
  const [username, setUserName] = useState();
  const [email, setEmail] = useState();
  const [idCompany, setCompanyId] = useState();
  const [profileID, setProfileID] =useState();
  const navigate = useNavigate();
  const { fetchDataTeam } = useTeamContext();

  const fetchData = () => {
    createAxios
      .get(process.env.REACT_APP_API_URL + '/api/users/me')
      .then((res) => {
        setUser(res.data);
        setEmail(res.data.email);
        getProfileById(res.data.id).then((response) => {
          setProfileID(response.data.data[0].id)
          setUserName(response.data.data[0].attributes.name);
          setUserPhoto(response.data.data[0].attributes.profilePhoto.data.attributes.url);
          setCompanyId(response.data.data[0].attributes.company.data.id);
        });
        setIsLoggedIn(true);
        navigate(<ProtectedRoute />);
      })
      .catch((err) => {
        setUser(null);
        setIsLoggedIn(false);
      });
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registerFunction = async (payload, formData) => {
    try {
      const authUser = await register(payload);
      setEmail(authUser.data.user.email);
      setIsLoggedIn(true);
      setUser(authUser.data);
      setUserName(authUser.data.user.username);
      console.log('id usera', authUser.data.user.id);
      localStorage.setItem('token', authUser.data.jwt);
      const photoResponse = await uploadUserPhoto(formData);
      const companyResponse = await createCompany(payload.company);
      console.log('companyRes', companyResponse);
      await createNewProfile(
        authUser.data.user.id,
        photoResponse.data[0].id,
        authUser.data.user.username,
        companyResponse.data.data.id
      );
      const userProfile = await getProfileById(authUser.data.user.id);
      console.log('id profila', userProfile.data.data[0].id);
      console.log('profile', userProfile);
      setUserPhoto(userProfile.data.data[0].attributes.profilePhoto.data.attributes.url);
      navigate('/my-profile');
    } catch (error) {
      throw error.response.data.error.message;
    }
  };

  const loginFunction = async (payload) => {
    try {
      const authUser = await login(payload);
      localStorage.setItem('token', authUser.data.jwt);
      getProfileById(authUser.data.user.id).then((response) => {
        if(response.data.data[0]){
          setUser(authUser);
          setEmail(authUser.data.user.email);
          setUserName(response.data.data[0].attributes.name);
          setUserPhoto(response.data.data[0].attributes.profilePhoto.data.attributes.url);
          setCompanyId(response.data.data[0].attributes.company.data.id);
          setIsLoggedIn(true);
          navigate('/my-profile');
        }
        else{
          localStorage.removeItem('token');
        }
      });
      const userProfile = await getProfileById(authUser.data.user.id);
      console.log('id profila', userProfile.data.data[0].id);
      console.log('profila', userProfile.data.data[0]);
      fetchDataTeam();
      fetchData();
    } catch (error) {
      console.error(error);
      setUser(null);
    }
  };
  const logoutFunction = () => {
    setUser(null);
    localStorage.removeItem('token');
    setUserPhoto(null);
    setUserName(null);
    setEmail(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginFunction,
        logoutFunction,
        registerFunction,
        isLoggedIn,
        userPhoto,
        setUserPhoto,
        username,
        setUserName,
        email,
        idCompany,
        profileID
      }}>
      {children}
    </AuthContext.Provider>
  );
};
export { AuthProvider, AuthContext, useAuthContext };
