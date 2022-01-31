import { Box } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const SideBar = () => {
  return (
    <Box
      display="flex"
      m={{ base: '0 auto' }}
      alignItems={{ base: 'center', md: 'flex-start' }}
      color="white"
      fontSize={{ base: '12px', sm: '14px', md: '16px' }}
      fontWeight="bold"
      flexDirection={{ base: 'row', md: 'column' }}
      p={{ base: '', md: '20px' }}
      textAlign={{ base: 'center', md: '' }}>
      <Box p="10px 10px">
        <Link to="/pending-for-approval">Pending for approval</Link>
      </Box>
      <Box p="10px 10px" >
        <Link to="/team" p="10px 10px">
          Team
        </Link>
      </Box>
      <Box p="10px 10px">
        <Link to="/questions" p="10px 10px">
          Questions
        </Link>
      </Box>
      <Box p="10px 10px">
        <Link to="/company-info" p="10px 10px">
          Company info
        </Link>
      </Box>
      <Box p="10px 10px">
        <Link to="/my-profile" p="10px 10px">
          My Profile
        </Link>
      </Box>
    </Box>
  );
};

export default SideBar;