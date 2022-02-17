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
// import Questions from './components/Profile/Questions/Questions';
import AddNewQuestion from './components/Profile/Questions/AddNewQuestion';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const { isLoggedIn} = useContext(AuthContext);

  return (
    <ChakraProvider>
      <Box backgroundColor="gray.200" width="100%" minH="100vh">
        <Nav />
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
          <Routes>
            <Route path="/" element={isLoggedIn ? <MyProfile /> : <Login />} />
            <Route path="/register" element={isLoggedIn ? <MyProfile /> : <Register />} />
            <Route path="/:pageName" element={<PageNotFound />}/>
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
            {/* <Route
              path="/questions"
              element={
                <ProtectedRoute>
                  <Questions />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/questions/new"
              element={
                <ProtectedRoute>
                  <AddNewQuestion />
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
