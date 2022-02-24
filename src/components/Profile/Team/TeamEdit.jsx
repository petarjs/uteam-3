import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTeamContext } from './TeamContextProvider';
import { useAuthContext } from '../../UserContext';
import { useState, useRef, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import SideBar from '../SideBar';
import { uploadUserPhoto } from '../../../services/upload';
import createAxios from '../../../services/http';
import { getQuestionsByCompanyID } from '../../../services/questions';
import { deleteProfile } from '../../../services/profile';
import {
  Flex,
  Input,
  Button,
  InputGroup,
  chakra,
  InputLeftElement,
  FormControl,
  Box,
  Text,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';

const CFiUser = chakra(FiUser);

const TeamEdit = (props) => {
  const { profileID } = useAuthContext();
  const { allMembers, setAllMembers, fetchDataTeam } = useTeamContext();
  const { id } = useParams();
  const filePicker = useRef(null);
  const finalRef = useRef();
  const [files, setFile] = useState(null);
  // eslint-disable-next-line eqeqeq
  const [data] = useState(allMembers.filter((item) => item.id == id));
  const [newUserName, setNewUserName] = useState(data[0]?.attributes.name);
  const [allQuestions, setAllQuestions] = useState([]);
  const [option] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    listQuestions();
  }, []);
  console.log(option);

  const listQuestions = async () => {
    try {
      const getAllQuestions = await getQuestionsByCompanyID();
      setAllQuestions(getAllQuestions.data.data);
      console.log("pitanja",getAllQuestions.data)
    } catch (error) {
      return;
    }
  };

  const setStatus = async (option) => {
    try {
      const idProfile = data[0].id;
      const response = await createAxios.put(`/api/profiles/${idProfile}`, {
        data: { status: option }
      });
      fetchDataTeam();
      return response;
    } catch (error) {
      return;
    }
  };

  const changeNameFunction = async (name) => {
    try {
      const idProfile = data[0].id;
      const response = await createAxios.put(`/api/profiles/${idProfile}`, {
        data: { name }
      });
      fetchDataTeam();
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const changeProfilePhotoFunction = async (formData) => {
    try {
      const photoResponse = await uploadUserPhoto(formData);
      const photoID = photoResponse.data[0].id;
      const idProfile = data[0].id;
      const response = await createAxios.put(`/api/profiles/${idProfile}`, {
        data: {
          profilePhoto: photoID
        }
      });
      fetchDataTeam();
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const clickAndDelete = (idProfile) => {
    deleteProfile(idProfile);
    onOpen();
    navigate('/team');
    const newListProfiles = allMembers.filter((member) => {
      return member.id !== idProfile;
    });
    setAllMembers(newListProfiles);
    fetchDataTeam();
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
        <SideBar />
      </Box>
      <Box w="100%">
        {
          <Box>
            <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent width={{ base: '300px', sm: '400px' }} mt="200px">
                <ModalCloseButton />
                <ModalBody m="20px 0">You have successfully deleted a user!</ModalBody>
              </ModalContent>
            </Modal>
          </Box>
        }
        <Flex
          minHeight="10vh"
          justifyContent="space-between"
          p={{ base: '8px 0', sm: '0 20px' }}
          flexDirection={{ base: 'column', sm: 'row' }}
          alignItems="center"
          borderBottom="1px solid #43b3ac">
          <Flex w="100%" justifyContent="space-between">
            <Text fontSize="28px">Edit team member</Text>{' '}
            <Flex>
              <FormControl w="130px" border="1px solid #007C8C" borderRadius="7px">
                <Select
                  value={option}
                  onChange={(e) => setStatus(e.target.value)}
                  _focus={{
                    border: '1px solid #007C8C'
                  }}>
                  <option value="" selected disabled hidden>
                    Select
                  </option>
                  <option value="published">Published</option>
                  <option value="pending">Pending</option>
                </Select>
              </FormControl>
              <Button
                disabled={profileID === data[0].id}
                m="0 5px"
                color="white"
                borderRadius="10px"
                bg="red.400"
                _hover={{ bg: 'red.600' }}
                _focus={{ outline: 'none' }}
                onClick={() => clickAndDelete(data[0].id)}>
                Delete
              </Button>
              <Link to={'/team'}>
                <Button
                  m="0 5px"
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
          </Flex>
        </Flex>
        <Flex
          minHeight="90vh"
          flexDirection={{ base: 'column', xl: 'row' }}
          justifyContent="center"
          alignItems={{ base: 'center', xl: 'flex-start' }}>
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
            <Box
              textAlign="center"
              p="0 30px 20px 30px"
              fontSize="20px"
              borderBottom="2px solid #80CBC4">
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
                    value={newUserName}
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
          {/* ANSWERS  */}
          <Box
            bg="white"
            mt="20px"
            mb="20px"
            mr={{ base: '', xl: '30px' }}
            p="30px 0"
            borderRadius="5px"
            fontSize="16px"
            boxShadow="xl"
            color="teal.400"
            textAlign="center"
            width={{ base: '300px', sm: '400px' }}>
            <Box
              textAlign="center"
              p="0 30px 20px 30px"
              fontSize="20px"
              borderBottom="2px solid #80CBC4">
              <Text>Answers</Text>
            </Box>
            <Flex flexDirection="column">
              {allQuestions.length !== 0 ? (
                allQuestions.map((questions) => (
                  <Box
                    textAlign="left"
                    key={questions.id}
                    p="10px 20px"
                    bg="white"
                    color="black"
                    borderBottom="1px solid #80CBC4"
                    fontSize="16px">
                    <Box mb="10px">Question - {questions.attributes.text}</Box>
                    <Box d="flex" flexDirection="column" alignItems="center">
                      {questions.attributes.type === 'image' ? (
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
                      ) : (
                        <Input
                          p="22px 5px"
                          // onChange={(e) => setAnswer(e.target.value)}
                          type="text"
                          _focus={{ border: '1px solid #007C8C' }}
                        />
                      )}
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
                ))
              ) : (
                <Box>Please add a new question!</Box>
              )}
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default TeamEdit;
