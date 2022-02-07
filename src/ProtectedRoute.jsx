import { AuthContext } from './components/UserContext';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);
  return isLoggedIn ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
