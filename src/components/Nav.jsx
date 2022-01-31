import { Link } from 'react-router-dom';
import {
  Box,
  Flex,
  Button,
  Img,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text
} from '@chakra-ui/react';
import { useContext } from 'react';
import { AuthContext } from './UserContext';
import logo from '../assets/logo.png';
const Nav = () => {
  const { user, logoutFunction, userPhoto, username } = useContext(AuthContext);
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      p="10px"
      backgroundColor="#004D4D"
      color="white"
      w="100vw"
      maxWidth="100%"
      flexDirection={{ base: 'column', sm: 'row' }}>
      <Img src={logo} w="220px" marginBottom={{ base: '20px', sm: '0' }} alt="logo" />
      <Flex alignItems="center">
        <Box>
          {userPhoto && (
            <Img
              src={`https://uteam-api-7nngy.ondigitalocean.app${userPhoto}`}
              w="50px"
              mr="10px"
              borderRadius="50%"
              alt="logo"
            />
          )}
        </Box>
        <Box>
          <Menu>
            <MenuButton>{user && username}</MenuButton>
            <MenuList mt="10px">
              <MenuItem color="black">
                {user && (
                  <Link to={'/my-profile'}>
                    <Box w="195px">Profile</Box>
                  </Link>
                )}
              </MenuItem>
              <MenuItem color="black">
                {user && (
                  <Link to={'/'}>
                    <Box
                      w="195px"
                      onClick={() => {
                        logoutFunction(null);
                      }}>
                      Logout
                    </Box>
                  </Link>
                )}
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
        <Box display="flex">
          {!user && (
            <Link to={'/'}>
              <Button
                borderRadius="10px"
                bg="teal.400"
                mr={{ base: '10px', sm: '10px' }}
                p="3px 20px"
                _hover={{ bg: 'teal.600' }}
                _focus={{ outline: 'none' }}>
                Login
              </Button>
            </Link>
          )}
          {!user && (
            <Link to={'/register'}>
              <Button
                borderRadius="10px"
                bg="teal.400"
                p="3px 20px"
                _hover={{ bg: 'teal.600' }}
                _focus={{ outline: 'none' }}>
                Register
              </Button>
            </Link>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};
export default Nav;