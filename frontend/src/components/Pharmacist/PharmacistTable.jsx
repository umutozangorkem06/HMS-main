import React, { useState, useEffect } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import axios from "axios";

const PharmacistTable = ({ pharmacistID }) => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/pharmacists/${pharmacistID}`)
      .then((response) => {
        setPrescriptions(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [pharmacistID]);

  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Reçete ID</Th>
            <Th>Hasta</Th>
            <Th>Doktor</Th>
            <Th>Durum</Th>
          </Tr>
        </Thead>
        <Tbody>
          {prescriptions.map((prescription, index) => (
            <Tr key={index}>
              <Td>{prescription.prescriptionID}</Td>
              <Td>{prescription.patientID}</Td>
              <Td>{prescription.doctorID}</Td>
              <Td>{prescription.medicationDetails}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default PharmacistTable;
