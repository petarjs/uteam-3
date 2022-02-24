import {
  Flex,
  Box,
  Grid,
  GridItem,
  Button,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useTeamContext } from './TeamContextProvider';
import { deleteProfile } from '../../../services/profile';
import { useRef } from 'react';
import { useAuthContext } from '../../UserContext';

const TeamList = () => {
  const { allMembers, setAllMembers, fetchDataTeam } = useTeamContext();
  const { profileID } = useAuthContext();

  const longEnUSFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef();

  const clickAndDelete = (idProfile) => {
    deleteProfile(idProfile);
    onOpen();
    const newListProfiles = allMembers.filter((member) => {
      return member.id !== idProfile;
    });
    setAllMembers(newListProfiles);
    fetchDataTeam();
  };
  return (
    <Grid
      templateColumns={{
        base: 'repeat(1, 270px)',
        md: 'repeat(2, 270px)',
        xl: 'repeat(3,270px)'
      }}
      margin="20px auto">
      {allMembers.map((member) =>
        member.attributes.status === 'published' ? (
          <GridItem
            key={member.id}
            m="7px 7px"
            p="10px"
            bg="white"
            borderRadius="5px"
            fontSize="16px"
            boxShadow="xl">
            <Box w="220px" h="220px" m="10px auto">
              {console.log(profileID, member.id)}
              <Image
                w="220"
                h="220"
                objectFit="cover"
                src={
                  process.env.REACT_APP_API_URL + member.attributes.profilePhoto.data.attributes.url
                }
              />
            </Box>
            <Flex justifyContent="space-between" alignItems="center" m="0 7px" fontSize="12px">
              <Box>
                <Box fontWeight="bold" w="150px">
                  {member.attributes.name}
                </Box>
                <Box>Joined {longEnUSFormatter.format(new Date(member.attributes.createdAt))}</Box>
              </Box>
              <Box bg="teal.600" p="2px 10px" color="white" borderRadius="5px">
                {member.attributes.status.charAt(0).toUpperCase() +
                  member.attributes.status.slice(1)}
              </Box>
            </Flex>
            <Flex m="15px 7px" justifyContent="space-between">
              <Link to={`/team/${member.id}/edit/`}>
                <Button
                  color="white"
                  borderRadius="10px"
                  bg="teal.400"
                  _hover={{ bg: 'teal.600' }}
                  _focus={{ outline: 'none' }}>
                  Edit
                </Button>
              </Link>
              <Button
                disabled={profileID === member.id}
                color="white"
                borderRadius="10px"
                bg="red.400"
                _hover={{ bg: 'red.600' }}
                _focus={{ outline: 'none' }}
                onClick={() => clickAndDelete(member.id)}>
                Delete
              </Button>
            </Flex>
          </GridItem>
        ) : (
          ''
        )
      )}
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
    </Grid>
  );
};

export default TeamList;
