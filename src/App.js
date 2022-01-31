import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { AuthContext } from './components/UserContext';
import Nav from './components/Nav';
import Register from './components/Register';
import Login from './components/Login';
import MyProfile from './components/Profile/MyProfile';
import PageNotFound from './components/PageNotFound';
import PendingForApproval from './components/Profile/PendingForApproval';
import CompanyInfo from './components/Profile/CompanyInfo';
import Team from './components/Profile/Team';
import Questions from './components/Profile/Questions';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <ChakraProvider>
      <Box backgroundColor="gray.200" width="100%" minHeight={'100vh'}>
        <Nav />
        <Box minHeight="100vha" display="flex" alignItems="center" justifyContent="center">
          <Routes>
            <Route path="/" element={isLoggedIn ? <MyProfile /> : <Login />} />
            <Route path="/register" element={isLoggedIn ? <MyProfile /> : <Register />} />
            <Route path="/:pageName" element={<PageNotFound />} />
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pending-for-approval"
              element={
                <ProtectedRoute>
                  <PendingForApproval />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company-info"
              element={
                <ProtectedRoute>
                  <CompanyInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions"
              element={
                <ProtectedRoute>
                  <Questions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <Team />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
      </Box>
    </ChakraProvider>
  );
}
export default App;
