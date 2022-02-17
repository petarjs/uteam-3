import {
  Flex,
  Input,
  Button,
  FormControl,
  Box,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import SideBar from '../SideBar';
import { Link } from 'react-router-dom';
import { useState, useRef, useContext, useEffect } from 'react';
import { Select } from '@chakra-ui/react';
import { addNewQuestion, getQuestions } from '../../../services/questions';
import { AuthContext } from '../../UserContext';

const AddNewQuestion = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef();
  const [newQuestion, setNewQuestion] = useState();
  const [questionError, setQuestionError] = useState();
  const [option, setOption] = useState();
  const { idCompany } = useContext(AuthContext);
  const [allQuestions, setAllQuestions] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    try {
      const getAllQuestions = await getQuestions();
      setAllQuestions(getAllQuestions.data);
    } catch (error) {
      return;
    }
  }, []);

  const functionForOrder = () => {
    const funForArray = async () => {
      const getAllQuestions = await getQuestions();
      setAllQuestions(getAllQuestions.data);
    };
    funForArray();
    let array = [];
    // eslint-disable-next-line array-callback-return
    allQuestions.map((questions) => {
      array.push({ order: questions.attributes.order });
    });
    let max = Math.max.apply(
      Math,
      array.map(function (o) {
        return o.order;
      })
    );
    if (max < 1) {
      max = 0;
    }
    return max + 1;
  };
  const saveAddNewQuestion = async (e) => {
    e.preventDefault();
    const valueQuestion = {
      text: newQuestion,
      type: option,
      order: functionForOrder(),
      company: idCompany
    };
    console.log(valueQuestion);
    try {
      if (
        valueQuestion.text &&
        (valueQuestion.type === 'text' ||
          valueQuestion.type === 'image' ||
          valueQuestion.type === 'long_text')
      ) {
        setQuestionError('');
      } else {
        setQuestionError('The fields must not be empty');
      }
      if (valueQuestion.text && valueQuestion.type) {
        await addNewQuestion(valueQuestion);
        onOpen();
      }
    } catch (error) {
      console.log(error);
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
          <Text fontSize={{ base: '22px', sm: '28px' }}>Add New Question</Text>
          <Link to={'/questions'}>
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
            width={{ base: '300px', sm: '450px' }}>
            <Box p="0 30px 0 30px">
              <FormControl mb="20px">
                <Box>
                  <Text textAlign="left" mb="2.5px">
                    Question text
                  </Text>
                  <Input
                    color="black"
                    onChange={(e) => setNewQuestion(e.target.value)}
                    type="text"
                    placeholder="Question text"
                    _focus={{ border: '1px solid #007C8C' }}
                  />
                </Box>
              </FormControl>
              <FormControl mb="20px">
                <Text textAlign="left" mb="2.5px">
                  Question type
                </Text>
                <Select
                  // value={option}
                  onChange={(e) => setOption(e.target.value)}
                  _focus={{
                    border: '1px solid #007C8C'
                  }}>
                  <option value="" selected disabled hidden>
                    Select question type
                  </option>
                  <option value="text">Text</option>
                  <option value="long_text">Long Text</option>
                  <option value="image">Image</option>
                </Select>
              </FormControl>
              {questionError ? (
                <Box color="red">{questionError}</Box>
              ) : (
                <Box>
                  <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent width={{ base: '300px', sm: '400px' }} mt="200px">
                      <ModalCloseButton />
                      <ModalBody m="20px 0">You have successfully added a question!</ModalBody>
                    </ModalContent>
                  </Modal>
                </Box>
              )}
              <Button
                onClick={saveAddNewQuestion}
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
        </Box>
      </Box>
    </Flex>
  );
};

export default AddNewQuestion;
