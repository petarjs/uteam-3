import { useEffect, useRef } from 'react';
import { Flex, Box, Button, Input } from '@chakra-ui/react';
import { CloseIcon, CheckIcon } from '@chakra-ui/icons';
import { _sortQuestionsbyOrder } from '../../../utils/sort-utils';
import { useNavigate } from 'react-router-dom';

const QuestionItemEdit = (props) => {
  const navigate = useNavigate();
  const question = props.question;
  const id = question.id;
  const type = question.attributes.type;
  const { editingQuestionId, editingQuestionsInputs, handleChangeEditingQuestions, handleSave } =
    props;

  const inputRef = useRef();

  useEffect(() => {
    if (editingQuestionId === id) {
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    }
  });

  let inputValue = '';
  if (editingQuestionsInputs[id]) {
    inputValue = editingQuestionsInputs[id];
  }

  return (
    <Flex
      justifyContent="space-between"
      border="1px solid #43b3ac"
      m="10px"
      borderRadius="10px"
      p="10px"
      background="white"
      boxShadow=" 1px 1px 0px black">
      <Flex w="100%" flexDirection="column">
        <Box fontWeight="500">Question - {type}</Box>
        <Input
          marginLeft="20px"
          ref={inputRef}
          type="text"
          variant="unstyled"
          value={inputValue}
          onChange={(e) => {
            handleChangeEditingQuestions(e, id);
          }}
        />
      </Flex>

      <Flex alignItems="center">
        <>
          <Button
            onClick={(e) => {
              handleSave(id);
            }}
            color="white"
            borderRadius="10px"
            bg="teal.400"
            p="3px 20px"
            _hover={{ bg: 'teal.600' }}
            _focus={{ outline: 'none' }}>
            Save
            <CheckIcon marginLeft="8px" />
          </Button>
          <Button
            onClick={(e) => {
              navigate('/questions');
            }}
            color="white"
            ml="5px"
            borderRadius="10px"
            bg="red"
            p="3px 20px"
            _hover={{ bg: 'red.600' }}
            _focus={{ outline: 'none' }}>
            Cancel
            <CloseIcon marginLeft="8px" w="13px" />
          </Button>
        </>
      </Flex>
    </Flex>
  );
};

export default QuestionItemEdit;
