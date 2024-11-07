import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Heading, Text, Stack, Avatar } from "@chakra-ui/react";

// Mock patient data
const mockPatients = [
  {
    patientID: "1",
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-01-01",
    gender: "Erkek",
    email: "john.doe@example.com",
    phoneNumber: "1234567890",
  },
  {
    patientID: "2",
    firstName: "Jane",
    lastName: "Smith",
    dateOfBirth: "1985-05-15",
    gender: "Kadın",
    email: "jane.smith@example.com",
    phoneNumber: "0987654321",
  },
  {
    patientID: "3",
    firstName: "Alice",
    lastName: "Johnson",
    dateOfBirth: "2000-09-25",
    gender: "Diğer",
    email: "alice.johnson@example.com",
    phoneNumber: "1122334455",
  },
];

const DoctorMain = ({ doctorID }) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Mocking the fetching of patients
    const fetchPatients = async () => {
      try {
        // Uncomment the line below when using real API
        // const response = await axios.get(`/doctor/${doctorID}/patients`);
        // setPatients(response.data);

        // Using mock data
        setPatients(mockPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, [doctorID]);

  return (
    <Box className="p-6 mt-16 bg-gray-100 min-h-screen">
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Hastaşarım
      </Heading>
      <Stack spacing={6}>
        {patients.map((patient) => (
          <Box
            key={patient.patientID}
            className="p-4 bg-white rounded-lg shadow-md flex items-center"
          >
            <Avatar
              name={`${patient.firstName} ${patient.lastName}`}
              size="lg"
              mr={4}
            />
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                {patient.firstName} {patient.lastName}
              </Text>
              <Text fontSize="md">
                Date of Birth:{" "}
                {new Date(patient.dateOfBirth).toLocaleDateString()}
              </Text>
              <Text fontSize="md">Gender: {patient.gender}</Text>
              <Text fontSize="md">Email: {patient.email}</Text>
              <Text fontSize="md">Phone Number: {patient.phoneNumber}</Text>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default DoctorMain;
