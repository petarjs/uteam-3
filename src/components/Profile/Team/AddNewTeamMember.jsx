import {
  Flex,
  Input,
  Button,
  FormControl,
  Box,
  chakra,
  Text,
  InputLeftElement,
  InputGroup,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import SideBar from '../SideBar';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock } from 'react-icons/fi';
import { HiOutlineMail } from 'react-icons/hi';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { registerForCompany } from '../../../services/auth';
import { createNewProfile, getProfileById } from '../../../services/profile';
import { getCompanyById } from '../../../services/company';
import { uploadUserPhoto } from '../../../services/upload';
import { useTeamContext } from './TeamContextProvider';

const CFiUser = chakra(FiUser);
const CHiOutlineMail = chakra(HiOutlineMail);
const CFiLock = chakra(FiLock);

const AddNewTeamMember = () => {
  const filePicker = useRef(null);
  const [files, setFile] = useState(null);
  const [error, setRegistrationError] = useState(null);
  const [duplicateEmail, setDuplicateEmail] = useState(null);
  const { register, handleSubmit } = useForm();
  const { allMembers, fetchDataTeam } = useTeamContext();
  const navigate = useNavigate();

  const registerFunction = async (payload, formData) => {
    try {
      let authUser = await registerForCompany(payload);
      const photoResponse = await uploadUserPhoto(formData);
      const companyResponse = await getCompanyById();
      await createNewProfile(
        authUser.data.user.id,
        photoResponse.data[0].id,
        authUser.data.user.username,
        companyResponse.data
      );
      const userProfile = await getProfileById(authUser.data.user.id);
      console.log(userProfile);
      if (userProfile.status === 200) {
        navigate('/team');
      }
    } catch (error) {
      throw error.response.data.error.message;
    }
  };

  const onSubmit = async (user) => {
    try {
      if (!user.name || !user.email || !user.password || files === null) {
        setRegistrationError('You did not enter all the correct data');
        return;
      } else {
        setRegistrationError(null);
      }

      if (
        typeof user.name === 'string' ||
        typeof user.email === 'string' ||
        typeof user.password === 'string'
      ) {
        setRegistrationError(null);
      } else {
        setRegistrationError('You did not enter all the correct data');
        return;
      }
      if (user.password.length < 6) {
        setRegistrationError('Password must have at least 6 characters');
        return;
      } else {
        setRegistrationError(null);
      }
      const formData = new FormData();
      formData.append('files', files[0]);
      await registerFunction(user, formData);
      fetchDataTeam();
    } catch (error) {
      setDuplicateEmail(error);
    }
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
          justifyContent="space-between"
          p={{ base: '10px 0', sm: '0 20px' }}
          flexDirection={{ base: 'column', sm: 'row' }}
          alignItems="center"
          borderBottom="1px solid #43b3ac">
          <Text fontSize={{ base: '22px', sm: '28px' }}>Add New Team Member</Text>
          <Link to={'/team'}>
            <Button
              color="white"
              borderRadius="10px"
              bg="teal.400"
              p="3px 20px"
              _hover={{ bg: 'teal.600' }}
              _focus={{ outline: 'none' }}>
              BACK
            </Button>
          </Link>
        </Flex>
        <Box
          minH={{ base: '80vh', sm: '90vh' }}
          display="flex"
          alignItems="center"
          justifyContent="center">
          <Box w={{ base: '300px', sm: '400px' }} color="teal.400" textAlign="center">
            <Box bg="white" mt="20px" p="30px" borderRadius="5px" fontSize="16px" boxShadow="xl">
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl mb="20px">
                  <Text textAlign="left" mb="2.5px">
                    Name
                  </Text>
                  <InputGroup color="black">
                    <InputLeftElement children={<CFiUser color="gray.300" />} />
                    <Input
                      {...register('name')}
                      type="text"
                      placeholder="Name"
                      _focus={{ border: '1px solid #007C8C' }}></Input>
                  </InputGroup>
                </FormControl>
                <FormControl mb="20px">
                  <Text textAlign="left" mb="2.5px">
                    Email
                  </Text>
                  <InputGroup color="black">
                    <InputLeftElement children={<CHiOutlineMail color="gray.300" />} />
                    <Input
                      {...register('email')}
                      type="email"
                      placeholder="Email address"
                      _focus={{ border: '1px solid #007C8C' }}></Input>
                  </InputGroup>
                </FormControl>
                <FormControl mb="20px">
                  <Text textAlign="left" mb="2.5px">
                    Password
                  </Text>
                  <InputGroup color="black">
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFiLock color="gray.300" />}
                    />
                    <Input
                      {...register('password')}
                      type="password"
                      placeholder="Password"
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
                    alignItems="center">
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
                <Flex justifyContent="space-between" alignItems="center">
                  <Link to={'/'}>
                    <Text _hover={{ color: 'teal.600' }}>Already have an account?</Text>
                  </Link>
                  <Button
                    type="submit"
                    color="white"
                    borderRadius="10px"
                    bg="teal.400"
                    p="3px 20px"
                    ml="10px"
                    _hover={{ bg: 'teal.600' }}
                    _focus={{ outline: 'none' }}>
                    Register
                  </Button>
                </Flex>
              </form>
              {error && (
                <Text color="red" textAlign="center" m="20px">
                  {error}
                </Text>
              )}
              {duplicateEmail && (
                <Text color="red" textAlign="center" m="20px">
                  {duplicateEmail}
                </Text>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default AddNewTeamMember;
