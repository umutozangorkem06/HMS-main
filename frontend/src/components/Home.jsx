import React from "react";
import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  Button,
  Center,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Center h="100vh">
      <Flex>
        <Box p={8} textAlign="center">
          <Heading mb={4}>Hoş Geldiniz!</Heading>
          <Text mb={4}>Türk Hastane Yönetim Sistemine Hoş Geldiniz.</Text>
          <Button onClick={() => navigate("/register")} colorScheme="teal">
            Randevu Al
          </Button>
        </Box>
      </Flex>
    </Center>
  );
};

export default Home;
