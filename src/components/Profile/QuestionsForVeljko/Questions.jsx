// import { Flex, Box, Text, Button } from '@chakra-ui/react';
// import SideBar from '../SideBar';
// import { Link } from 'react-router-dom';
// import QuestionList from './QuestionList';

// const Questions = () => {
//   return (
//     <Flex minHeight="100vh" w="100vw" flexDirection={{ base: 'column', md: 'row' }}>
//       <Box
//         display="flex"
//         bg="teal.400"
//         minHeight={{ base: '70px', md: '100vh' }}
//         w={{ base: '100%', md: '330px' }}>
//         <SideBar />{' '}
//       </Box>
//       <Box w="100%">
//         <Flex
//           minHeight="10vh"
//           justifyContent="space-between"
//           p={{ base: '8px 0', sm: '0 20px' }}
//           flexDirection={{ base: 'column', sm: 'row' }}
//           alignItems="center"
//           borderBottom="1px solid #43b3ac">
//           <Text fontSize={{ base: '22px', sm: '28px' }}>Questions</Text>
//           <Link to={'/questions/new'}>
//             <Button
//               color="white"
//               borderRadius="10px"
//               bg="teal.400"
//               p="3px 20px"
//               _hover={{ bg: 'teal.600' }}
//               _focus={{ outline: 'none' }}>
//               + Add new question
//             </Button>
//           </Link>
//         </Flex>
//         <QuestionList />
//       </Box>
//     </Flex>
//   );
// };

// export default Questions;
