import {
  Flex,
  Input,
  Button,
  InputGroup,
  InputLeftElement,
  FormControl,
  chakra,
  Box,
  Text
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { HiOutlineMail } from 'react-icons/hi';
import { useState } from 'react';
import { useAuthContext } from './UserContext';
const CHiOutlineMail = chakra(HiOutlineMail);
const CFiLock = chakra(FiLock);

const Login = () => {
  const { loginFunction } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const handleLogIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(true);
      return false;
    } else {
      const data = {
        email,
        password
      };
      loginFunction(data);
    }
  };

  return (
    <Flex justifyContent="center" alignItems="center">
      <Box color="teal.400" textAlign="center" width={{ base: '300px', sm: '400px' }}>
        <Text fontSize="24px" fontWeight="bold">
          uTeam - Login
        </Text>
        <Box bg="white" mt="20px" p="30px" borderRadius="5px" fontSize="16px" boxShadow="xl">
          <FormControl mb="20px">
            <Text textAlign="left" mb="2.5px">
              Email
            </Text>
            <InputGroup color="black">
              <InputLeftElement children={<CHiOutlineMail color="gray.300" />} />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email address"
                _focus={{ border: '1px solid #007C8C' }}
              />
            </InputGroup>
          </FormControl>
          <FormControl mb="20px">
            <Text textAlign="left" mb="2.5px">
              Password
            </Text>
            <InputGroup color="black">
              <InputLeftElement children={<CFiLock color="gray.300" />} />
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                _focus={{ border: '1px solid #007C8C' }}
              />
            </InputGroup>
          </FormControl>
          <Flex justifyContent="space-between" alignItems="center">
            <Link to={'/register'}>
              <Text _hover={{ color: 'teal.600' }}>Don’t have an account?</Text>
            </Link>
            <Button
              onClick={handleLogIn}
              color="white"
              borderRadius="10px"
              bg="teal.400"
              p="3px 20px"
              ml="10px"
              _hover={{ bg: 'teal.600' }}
              _focus={{ outline: 'none' }}>
              Login
            </Button>
          </Flex>
          {error && (
            <Text color="red" textAlign="center" mt="3" mb="3">
              Invalid email or password
            </Text>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;
