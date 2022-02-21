import {
  Flex,
  Box,
  Text,
  Button,
  Input,
  chakra,
  InputGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure
} from '@chakra-ui/react';
import SideBar from './SideBar';
import { AiOutlineArrowUp, AiOutlineArrowDown } from 'react-icons/ai';
import { getQuestionsByCompanyID } from '../../services/questions';
import { postAnswers } from '../../services/answers';
import { getProfileById } from '../../services/profile';
import { useEffect, useState, useRef } from 'react';
import { uploadUserPhoto } from '../../services/upload';
import createAxios from '../../services/http';

const QuestionsAndAnswers = () => {
  const CAiOutlineArrowUp = chakra(AiOutlineArrowUp);
  const CAiOutlineArrowDown = chakra(AiOutlineArrowDown);
  const [allQuestions, setAllQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const filePicker = useRef(null);
  const [files, setFile] = useState(null);
  const [allAnswers, setAllAnswers] = useState([]);
  const [answer, setAnswer] = useState();
  const finalRef = useRef();
  const [questionError, setQuestionError] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const indexUp = () => {
    if (allAnswers[index].answer) {
      if (allQuestions.length - 1 > index) {
        setIndex(index + 1);
        setQuestionError('');
      } else {
        setIndex(allQuestions.length - 1);
      }
    } else {
      setQuestionError('The field must not be empty');
    }
  };

  const indexDown = () => {
    if (allAnswers[index].answer) {
      if (index === 0) {
        setIndex(0);
        setQuestionError('');
      } else {
        setIndex(index - 1);
      }
    } else {
      setQuestionError('The field must not be empty');
    }
  };

  const onChangeSave = async (e) => {
    let answers = allAnswers;
    console.log(answers);
    console.log('da', allQuestions[index].attributes.type);
    if (allQuestions[index].attributes.type === 'image') {
      const formData = new FormData();
      formData.append('files', files[0]);
      const photoResponse = await uploadUserPhoto(formData);
      console.log(photoResponse.data[0].url);
      answers[index].answer = process.env.REACT_APP_API_URL + photoResponse.data[0].url;
    } else {
      answers[index].answer = e.target.value;
    }
    setAllAnswers(answers);
    if (answers[index].answer) {
      setQuestionError('');
    } else {
      setQuestionError('The field must not be empty');
    }
    console.log(allAnswers);
    console.log(answers);
  };

  const nextFun = () => {
    if (allAnswers[index].answer) {
      if (allQuestions.length - 1 > index) {
        setIndex(index + 1);
        setQuestionError('');
      } else {
        setIndex(allQuestions.length - 1);
      }
    } else {
      setQuestionError('The field must not be empty');
    }
    console.log(allAnswers[index]);
  };

  const listQuestion = async () => {
    const responseUser = await createAxios.get('/api/users/me');
    const resProfile = await getProfileById(responseUser.data.id);
    // console.log(resProfile.data.data[0].id)
    const idProfile = resProfile.data.data[0].id;
    const getAllQuestions = await getQuestionsByCompanyID();
    console.log(getAllQuestions.data.data);
    setAllQuestions(getAllQuestions.data.data);

    let answers = [];
    for (let questionIndex in getAllQuestions.data.data) {
      answers.push({
        id: getAllQuestions.data.data[questionIndex].id,
        profile: idProfile,
        answer: ''
      });
    }
    setAllAnswers(answers);
  };

  const saveAndPost = async (e) => {
    if (allAnswers[index].answer) {
      setQuestionError('');
    } else {
      setQuestionError('The field must not be empty');
    }
    e.preventDefault();
    const responseUser = await createAxios.get('/api/users/me');
    const responseProfile = await getProfileById(responseUser.data.id);
    const idProfile = responseProfile.data.data[0].id;

    for (let i = 0; i < index + 1; i++) {
      const valueQuestion = {
        question: allQuestions[i].id,
        profile: idProfile,
        answer: allAnswers[i].answer
      };
      console.log(valueQuestion);
      const resPostAnswers = await postAnswers(valueQuestion);
      if (resPostAnswers.status === 200) {
        onOpen();
        console.log(resPostAnswers);
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    try {
      listQuestion();
    } catch (error) {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          justifyContent="flex-start"
          p={{ base: '8px 0', sm: '0 20px' }}
          flexDirection={{ base: 'column', sm: 'row' }}
          alignItems="center"
          borderBottom="1px solid #43b3ac">
          <Text fontSize={{ base: '22px', sm: '28px' }}>Questions and Answers</Text>
        </Flex>
        {allQuestions.length === 0 ? (
          <Box p="20px">There are no questions :(</Box>
        ) : (
          <Flex p="20px" justifyContent="center" alignItems="center" flexDirection="column">
            <Flex alignItems="center" w="100%">
              <Flex flexDirection="column">
                <Flex flexDirection="column">
                  <Button
                    onClick={indexUp}
                    bg="teal.400"
                    borderBottomLeftRadius="0px"
                    borderBottomRightRadius="0px"
                    _hover={{ bg: 'teal.600' }}
                    _focus={{ outline: 'none' }}>
                    <CAiOutlineArrowUp p="5px" size="30px" color="white" />
                  </Button>
                  <Button
                    onClick={indexDown}
                    bg="teal.400"
                    borderTopLeftRadius="0px"
                    borderTopRightRadius="0px"
                    _hover={{ bg: 'teal.600' }}
                    _focus={{ outline: 'none' }}>
                    <CAiOutlineArrowDown p="5px" size="30px" color="white" />
                  </Button>
                </Flex>
                <Box textAlign="center">{index + 1 + '/' + allQuestions.length}</Box>
              </Flex>
              <Box flexGrow="1">
                <Box
                  key={allQuestions[index]?.id}
                  m="5px 10px"
                  p="10px"
                  bg="white"
                  borderRadius="5px"
                  fontSize="16px"
                  boxShadow="xl">
                  <Box mb="10px" p="7px" backgroundColor="gray.100" borderRadius="5px">
                    {allQuestions[index]?.attributes?.text}
                  </Box>
                  {allQuestions[index]?.attributes?.type === 'image' ? (
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
                        onChange={(e) => {
                          setFile(e.target.files);
                          onChangeSave(e);
                        }}
                      />
                    </InputGroup>
                  ) : (
                    <Input
                      p="22px 5px"
                      onChange={(e) => {
                        setAnswer(e.target.value);
                        onChangeSave(e);
                      }}
                      type="text"
                      value={allAnswers[index]?.answer}
                      id="questionAnswer"
                      _focus={{ border: '1px solid #007C8C' }}
                    />
                  )}
                  {questionError ? (
                    <Box p="5px 5px 0 10px" color="red">
                      {questionError}
                    </Box>
                  ) : (
                    <Box>
                      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent width={{ base: '300px', sm: '400px' }} mt="200px">
                          <ModalCloseButton />
                          <ModalBody m="20px 0">Thank you!</ModalBody>
                        </ModalContent>
                      </Modal>
                    </Box>
                  )}
                </Box>
              </Box>
            </Flex>
            {allQuestions.length === index + 1 ? (
              <Button
                onClick={saveAndPost}
                color="white"
                borderRadius="10px"
                bg="teal.400"
                p="3px 40px"
                mt="20px"
                _hover={{ bg: 'teal.600' }}
                _focus={{ outline: 'none' }}>
                Save
              </Button>
            ) : (
              <Button
                onClick={nextFun}
                color="white"
                borderRadius="10px"
                bg="teal.400"
                p="3px 40px"
                mt="20px"
                _hover={{ bg: 'teal.600' }}
                _focus={{ outline: 'none' }}>
                Next
              </Button>
            )}
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default QuestionsAndAnswers;
