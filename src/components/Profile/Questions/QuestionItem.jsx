import { Flex, Box, Text, Button } from '@chakra-ui/react';
import { DeleteIcon, EditIcon, ArrowUpDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const QuestionItem = (props) => {
  const navigate = useNavigate();
  const question = props.question;
  const id = question.id;
  const type = question.attributes.type;
  const { originalIndex, setEditingQuestionId, handleDelete } = props;

  return (
    <Flex
      justifyContent="space-between"
      border="1px solid #43b3ac"
      m="10px"
      borderRadius="10px"
      p="10px"
      background="white"
      boxShadow=" 1px 1px 0px black"
      className="drag-me-area dnd-item">
      <Flex w="100%" flexDirection="column">
        <Box fontWeight="500" className="drag-me-area">
          <ArrowUpDownIcon cursor="pointer" className="drag-me-area" /> Question {originalIndex + 1}{' '}
          - {type}
        </Box>
        <Text marginLeft="20px">{question.attributes.text}</Text>
      </Flex>

      <Flex alignItems="center">
        <>
          <Button
            onClick={(e) => {
              setEditingQuestionId(id);
              navigate('/questions/edit/' + id);
            }}
            color="white"
            borderRadius="10px"
            bg="teal.400"
            p="3px 20px"
            _hover={{ bg: 'teal.600' }}
            _focus={{ outline: 'none' }}>
            Edit
            <EditIcon marginLeft="8px" />
          </Button>
          <Button
            onClick={(e) => {
              handleDelete(id);
            }}
            color="white"
            borderRadius="10px"
            bg="red"
            p="3px 20px"
            ml="5px"
            _hover={{ bg: 'red.600' }}
            _focus={{ outline: 'none' }}>
            Delete
            <DeleteIcon marginLeft="5px" />
          </Button>
        </>
      </Flex>
    </Flex>
  );
};

export default QuestionItem;
