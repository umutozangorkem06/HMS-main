import React from "react";
import {
  Box,
  Heading,
  Grid,
  GridItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import PharmacistTable from "./PharmacistTable";

const yourPharmacistID = localStorage.getItem("userID");
const PharmacistMain = () => {
  return (
    <Box p={4}>
      <Heading as="h1" mb={4}>
        Eczacı Ekranı
      </Heading>

      <Box p={4} bg="gray.100" borderRadius="md">
        <Heading as="h2" size="md" mb={2}>
          Prescriptions
        </Heading>
        <Table size="sm">
          <PharmacistTable pharmacistID={yourPharmacistID} />
        </Table>
      </Box>
    </Box>
  );
};

export default PharmacistMain;
