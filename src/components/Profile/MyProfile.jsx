import {
  Flex,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
  FormControl,
  chakra,
  Box,
  Text,
  FormLabel
} from '@chakra-ui/react';
import SideBar from './SideBar';
import { FiUser, FiLock } from 'react-icons/fi';
import React, { useRef, useState, useContext } from 'react';
import { AuthContext } from '../UserContext';
import { changeName, changeProfilePhoto, getProfileById } from '../../services/profile';
import { uploadUserPhoto } from '../../services/upload';
import createAxios from '../../services/http';

const CFiUser = chakra(FiUser);
const CFiLock = chakra(FiLock);

const MyProfile = () => {
  const filePicker = useRef(null);
  const [files, setFile] = useState(null);
  const { username, setUserName, setUserPhoto, email } = useContext(AuthContext);
  const [newUserName, setNewUserName] = useState(username);

  const changeNameFunction = async (name) => {
    try {
      const authUser = await changeName(name);
      setUserName(authUser.data.data.attributes.name);
    } catch (error) {
      console.error(error);
    }
  };

  const changeProfilePhotoFunction = async (formData) => {
    try {
      const photoResponse = await uploadUserPhoto(formData);
      await changeProfilePhoto(photoResponse.data[0].id);
      const responseUser = await createAxios.get(process.env.REACT_APP_API_URL + '/api/users/me');
      const responseProfile = await getProfileById(responseUser.data.id);
      setUserPhoto(responseProfile.data.data[0].attributes.profilePhoto.data.attributes.url);
    } catch (error) {
      console.error(error);
    }
  };

  const saveBasicInfo = async (e) => {
    e.preventDefault();
    changeNameFunction(newUserName);
    const formData = new FormData();
    formData.append('files', files[0]);
    await changeProfilePhotoFunction(formData);
  };
  return (
    <Flex minHeight="100vh" w="100vw" flexDirection={{ base: 'column', md: 'row' }}>
      <Box
        display="flex"
        bg="teal.400"
        minHeight={{ base: '70px', md: '100vh' }}
        w={{ base: '100%', md: '330px' }}>
        <SideBar />{' '}
      </Box>
      <Box w="100%">
        <Flex
          minHeight="10vh"
          justifyContent={{ base: 'center', md: 'flex-start' }}
          pl={{ base: '0', md: '20px' }}
          alignItems="center"
          borderBottom="1px solid #43b3ac">
          <Text fontSize="28px">My Profile</Text>
        </Flex>
        <Flex
          minHeight="90vh"
          flexDirection={{ base: 'column', xl: 'row' }}
          justifyContent="center"
          alignItems="center">
          {/* BASIC INFO  */}
          <Box
            bg="white"
            mt="20px"
            mr={{ base: '', xl: '30px' }}
            p="30px 0"
            borderRadius="5px"
            fontSize="16px"
            boxShadow="xl"
            color="teal.400"
            textAlign="center"
            width={{ base: '300px', sm: '400px' }}>
            <Box textAlign="center" p="0 30px 20px 30px" fontSize="20px">
              <Text>Basic Info</Text>
            </Box>
            <Box p="20px 30px 0 30px">
              <FormControl mb="20px">
                <Text textAlign="left" mb="2.5px">
                  Name
                </Text>
                <InputGroup color="black">
                  <InputLeftElement children={<CFiUser color="gray.300" />} />
                  <Input
                    // value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    type="text"
                    placeholder="Name"
                    _focus={{ border: '1px solid #007C8C' }}
                  />
                </InputGroup>
              </FormControl>
              <FormControl mb="20px">
                <Text textAlign="left" mb="2.5px">
                  Profile Photo
                </Text>
                <InputGroup
                  border="1px solid #e2e8f0"
                  borderRadius="5px"
                  p="2px 5px 2px 2px"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb="20px">
                  <Button
                    _focus={{ outline: 'none' }}
                    _hover={{
                      background: 'teal.600'
                    }}
                    color="white"
                    bg="teal.400"
                    borderRadius="5px"
                    onClick={() => {
                      filePicker.current.click();
                    }}>
                    {' '}
                    Choose Photo
                  </Button>
                  <Text htmlFor="file-upload" fontSize="12px" color="black.200">
                    {files ? files[0].name : 'No file chosen'}
                  </Text>
                  <Input
                    type="file"
                    ref={filePicker}
                    display="none"
                    onChange={(e) => setFile(e.target.files)}
                  />
                </InputGroup>
              </FormControl>
              <Button
                onClick={saveBasicInfo}
                color="white"
                borderRadius="10px"
                bg="teal.400"
                p="3px 40px"
                mt="20px"
                _hover={{ bg: 'teal.600' }}
                _focus={{ outline: 'none' }}>
                Save
              </Button>
            </Box>
          </Box>
          {/* SECURITY */}
          <Box
            bg="white"
            mt="20px"
            p="30px 0"
            mb={{ base: '30px', xl: '0' }}
            borderRadius="5px"
            fontSize="16px"
            boxShadow="xl"
            color="teal.400"
            textAlign="center"
            width={{ base: '300px', sm: '400px' }}>
            <Box textAlign="center" p="0 30px 20px 30px" fontSize="20px">
              <Text>Security</Text>
            </Box>
            <Box p="20px 30px 0 30px">
              <FormControl mb="20px">
                <Text textAlign="left" mb="2.5px">
                  Email
                </Text>
                <FormLabel color="black">{email}</FormLabel>
              </FormControl>
              <FormControl mb="20px">
                <Text textAlign="left" mb="2.5px">
                  Current password
                </Text>
                <InputGroup color="black">
                  <InputLeftElement children={<CFiLock color="gray.300" />} />
                  <Input
                    // value=""
                    type="password"
                    placeholder="Current password"
                    _focus={{ border: '1px solid #007C8C' }}
                  />
                </InputGroup>
              </FormControl>
              <FormControl mb="20px">
                <Text textAlign="left" mb="2.5px">
                  New password
                </Text>
                <InputGroup color="black">
                  <InputLeftElement children={<CFiLock color="gray.300" />} />
                  <Input
                    // value=""
                    type="password"
                    placeholder="New password"
                    _focus={{ border: '1px solid #007C8C' }}
                  />
                </InputGroup>
              </FormControl>
              <Button
                // onClick={handleLogIn}
                color="white"
                borderRadius="10px"
                bg="teal.400"
                p="3px 40px"
                mt="20px"
                _hover={{ bg: 'teal.600' }}
                _focus={{ outline: 'none' }}>
                Save
              </Button>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default MyProfile;
