import { Flex, Box, Text, FormControl, InputGroup, Input, Button, Img } from '@chakra-ui/react';
import SideBar from './SideBar';
import { getCompany } from '../../services/company';
import { useContext, useRef, useState } from 'react';
import { useEffect } from 'react';
import { AuthContext } from '../UserContext';
import { uploadUserPhoto } from '../../services/upload';
import { getProfileById } from '../../services/profile';
import createAxios from '../../services/http';
const CompanyInfo = () => {
  const filePicker = useRef(null);
  const [files, setFile] = useState(null);
  const { isLoggedIn, user } = useContext(AuthContext);
  const [currCompany, setCompanyName] = useState('');
  const [idCompany, setIdCompany] = useState('');
  const [companyLogo, setCompanyLogo] = useState(null);

  useEffect(() => {
    if (isLoggedIn) {
      // if the user is logged in, send request and set idCompany and CompanyName
      getProfileById(user.id).then((response) => {
        setIdCompany(response.data.data[0].attributes.company.data.id);
        setCompanyName(response.data.data[0].attributes.company.data.attributes.name);
        if (idCompany) {
          // aftrer refresh page send request for get company and fill company logo
          getCompany(idCompany).then((response) => {
            setCompanyLogo(response.data.data.attributes.logo.data.attributes.url);
          });
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCompany]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('files', files[0]);
    const uploaResponse = await uploadUserPhoto(formData);

    // first send request for upload, after that send request for update Company with the data we received from the upload (specifically image id)
    const data = { name: currCompany, logo: uploaResponse.data[0].id };
    const responseUpdate = await createAxios.put(
      '/api/companies/' + idCompany,
      {
        data: {
          ...data
        }
      },
      {
        params: {
          populate: ['logo']
        }
      }
    );
    setCompanyLogo(responseUpdate.data.data.attributes.logo.data.attributes.url);
    setCompanyName(responseUpdate.data.data.attributes.name);
  };

  return (
    <Flex w="100vw" flexDirection={{ base: 'column', md: 'row' }}>
      <Box
        display="flex"
        bg="teal.400"
        h={{ base: '70px', md: '100vh' }}
        w={{ base: '100%', md: '230px' }}>
        <SideBar />
      </Box>
      <Box bg="white" p="30px" borderRadius="5px" fontSize="16px" height={'100vh'}>
        <Text fontSize="24px" fontWeight="bold" marginBottom={'40px'}>
          Company Info
        </Text>

        <FormControl mb="20px">
          <Text textAlign="left" marginBottom={'20px'}>
            Company Name
          </Text>
          <InputGroup color="black">
            <Input
              value={currCompany}
              onChange={(e) => setCompanyName(e.target.value)}
              type="text"
              placeholder={currCompany}
              required
            />
          </InputGroup>
          <InputGroup
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb="20px"
            marginTop={'30px'}
            border="1px solid #cbd5e0"
            borderRadius={'5px'}
            padding={'5px'}>
            <Button
              _focus={{ outline: 'none' }}
              _hover={{
                background: 'teal.600'
              }}
              color="white"
              bg="teal.400"
              borderRadius="10px"
              onClick={() => {
                filePicker.current.click();
              }}>
              {' '}
              chose file
            </Button>
            <Text htmlFor="file-upload" fontSize="12px" color="black.200">
              {files ? files[0].name : 'Upload file'}
            </Text>
            <Input
              required
              type="file"
              ref={filePicker}
              display="none"
              onChange={(e) => setFile(e.target.files)}
            />
          </InputGroup>
          <Flex alignItems="center" justifyContent={'end'}>
            <Button
              onClick={handleSubmit}
              color="white"
              borderRadius="10px"
              bg="teal.400"
              p="3px 20px"
              ml="10px"
              _hover={{ bg: 'teal.600' }}
              _focus={{ outline: 'none' }}>
              Save
            </Button>
          </Flex>
        </FormControl>
        {companyLogo && (
          <Flex justifyContent={'center'} flexDirection={'column'} alignItems={'center'}>
            <Text marginBottom={'10px'}>Your company logo</Text>
            <Img
              src={`https://uteam-api-7nngy.ondigitalocean.app${companyLogo}`}
              width={'200px'}></Img>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default CompanyInfo;
