import { Flex, Box, Text, Button } from '@chakra-ui/react';
import SideBar from '../SideBar';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { CloseIcon } from '@chakra-ui/icons';
import createAxios from '../../../services/http';
import { sortQuestionsbyOrder } from '../../../utils/sort-utils';
import QuestionItem from './QuestionItem';
import ReactDragListView from 'react-drag-listview';
import { Spiner } from './Spiner';
import { getQuestions, DeleteQuestionById } from '../../../services/question';
import QuestionItemEdit from './QuestionItemEdit';
import { AuthContext } from '../../UserContext';

const selectSingleQuestionById = (id, questions) => {
  let selected = false;
  questions.forEach((question) => {
    if (question.id === id) {
      selected = question;
    }
  });
  return selected;
};

const getOriginalIndexById = (id, questionsOriginal) => {
  let selectedindex = false;
  if (Array.isArray(questionsOriginal)) {
    questionsOriginal.forEach((question, index) => {
      if (question.id === id) {
        selectedindex = index;
      }
    });
  }
  return selectedindex;
};

const Questions = (props) => {
  const { idCompany } = useContext(AuthContext);

  const navigate = useNavigate();
  let { id } = useParams();
  id = parseInt(id);
  let editingQuestion = false;
  const [questions, setQuestions] = useState([]); // also state for drag and drop
  const [questionsOriginal, setQuestionsOriginal] = useState([]); //state for original index
  let editMode = false;
  if (props.editMode === true) {
    editMode = true;
    editingQuestion = selectSingleQuestionById(id, questions);
  }
  const [editingQuestionsInputs, setEditingQuestionsInputs] = useState([]); // here is values za for each input field of each question
  const [editingQuestionId, setEditingQuestionId] = useState(null); // data which question is in edit mode
  const [spinner, setSpinner] = useState(false);
  const handleChangeEditingQuestions = (e, id) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setEditingQuestionsInputs({
      ...editingQuestionsInputs,
      [id]: value
    });
  };

  const refresh = () => {
    setSpinner(true);
    if (idCompany) {
      console.log('Branislav', idCompany);
      getQuestions(idCompany).then((res) => {
        console.log('question', res);
        setSpinner(false);
        if (res && res.data && Array.isArray(res.data.data)) {
          const sortiraniQuestions = sortQuestionsbyOrder(res.data.data);
          setQuestions(sortiraniQuestions);
          setQuestionsOriginal(sortiraniQuestions);
          // we are now filling in the inputs
          let inputValues = {};
          res.data.data.forEach((question) => {
            inputValues[question.id] = question.attributes.text;
          });
          setEditingQuestionsInputs(inputValues);
        }
      });
    }
  };
  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCompany]);

  const _handleDelete = (id) => {
    if (id) {
      const confirm = window.confirm('Da li ste sigurni da zelite da obrisete pitanje?');
      if (confirm === false) {
        return;
      }
    }
    setSpinner(true);
    createAxios.delete('api/questions/' + id).then((res) => {
      console.log('question', res);

      refresh();
    });
  };

  const _handleSave = (id) => {
    // save edited question
    const dataForSubmit = editingQuestionsInputs[id];

    const validator = () => {
      if (typeof dataForSubmit === 'string' && dataForSubmit !== '') {
        return true;
      }
      return false;
    };
    if (validator(dataForSubmit)) {
      console.log('validated');
      setSpinner(true);
      DeleteQuestionById(id, dataForSubmit).then((res) => {
        console.log('api edit question respose', res);

        navigate('/questions');
        refresh(); // to fetch the question again and see the changes from the database
        setEditingQuestionId(null); //to return from edit mode to normal mode
      });
    } else {
      window.alert('niste popunili polje!');
    }
  };

  // ReactDragListView widget settings
  const dndState = questions; //adapt the name to know the ode's questions also state for drag and drop
  const setDndState = setQuestions;
  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const data = [...dndState];
      const item = data.splice(fromIndex, 1)[0];
      data.splice(toIndex, 0, item);
      setDndState(data);
    },
    nodeSelector: '.dnd-item', // selector for the element that is drag
    handleSelector: '.drag-me-area' // selector for the element on which we detect drag.
  };

  return (
    <>
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
            p={{ base: '8px 0', sm: '0 20px' }}
            flexDirection={{ base: 'column', sm: 'row' }}
            alignItems="center"
            borderBottom="1px solid #43b3ac">
            {!editMode && (
              <>
                <Text fontSize={{ base: '22px', sm: '28px' }}>Questions</Text>
                <Link to={'/add-new-question'}>
                  <Button
                    color="white"
                    borderRadius="10px"
                    bg="teal.400"
                    p="3px 20px"
                    _hover={{ bg: 'teal.600' }}
                    _focus={{ outline: 'none' }}>
                    <CloseIcon transform={'rotate(45deg)'} marginRight={'10px'} /> Add new question
                  </Button>
                </Link>
              </>
            )}
            {editMode && (
              <>
                <Text fontSize={{ base: '22px', sm: '28px' }}>Edit Question</Text>
              </>
            )}
          </Flex>

          {spinner && <Spiner />}

          {editMode && editingQuestion && (
            <QuestionItemEdit
              key={id}
              question={editingQuestion}
              editingQuestionId={editingQuestionId}
              editingQuestionsInputs={editingQuestionsInputs}
              handleChangeEditingQuestions={handleChangeEditingQuestions}
              handleSave={_handleSave}
            />
          )}

          {!editMode && (
            <ReactDragListView {...dragProps}>
              {questions.map((question) => {
                const id = question.id;
                return (
                  <QuestionItem
                    key={id}
                    originalIndex={getOriginalIndexById(id, questionsOriginal)}
                    question={question}
                    editingQuestionId={editingQuestionId}
                    setEditingQuestionId={setEditingQuestionId}
                    handleDelete={_handleDelete}
                  />
                );
              })}
            </ReactDragListView>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default Questions;
