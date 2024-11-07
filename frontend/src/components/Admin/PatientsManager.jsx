import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  HStack,
  Button,
  Center,
  Spinner,
  useToast,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  Select,
} from "@chakra-ui/react";
import axios from "axios";

const PatientsManager = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState({
    patientID: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/patients")
      .then((response) => {
        setPatients(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast({
          title: "Error fetching patients",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }, [toast]);

  const handleCheck = (patientID, isChecked) => {
    setSelectedPatients((prev) =>
      isChecked ? [...prev, patientID] : prev.filter((id) => id !== patientID)
    );
  };

  const deletePatients = () => {
    axios
      .all(
        selectedPatients.map((patientID) =>
          axios.delete(`http://localhost:3000/patients/${patientID}`)
        )
      )
      .then(() => {
        setPatients((prev) =>
          prev.filter(
            (patient) => !selectedPatients.includes(patient.patientID)
          )
        );
        setSelectedPatients([]);
        toast({
          title: "Patients deleted successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error deleting patients",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const convertedValue =
      name === "dateOfBirth" ? convertDateFormat(value) : value;

    setPatientData({ ...patientData, [name]: convertedValue });
  };

  const convertDateFormat = (dateString) => {
    const parts = dateString.split("/");
    if (parts.length !== 3) return dateString; // Return the original string if format is incorrect
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const addPatient = () => {
    const formattedPatientData = {
      ...patientData,
      dateOfBirth: new Date(patientData.dateOfBirth).toISOString().slice(0, 10),
    };

    console.log(formattedPatientData);
    axios
      .post("http://localhost:3000/patients", formattedPatientData)
      .then((response) => {
        toast({
          title: "Patient added successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        // Update the patients state to include the new patient
        setPatients((prev) => [...prev, response.data]);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error adding patient",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    setPatientData([...patientData, newPatientData]);
  };

  const openEditModal = (patient) => {
    setPatientData({
      patientID: patient.patientID,
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: new Date(patient.dateOfBirth).toISOString().slice(0, 10), // format the date
      gender: patient.gender,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      password: "", // leave password empty for security
    });
    setIsEdit(true);
    onOpen();
  };

  const updatePatient = () => {
    axios
      .put(
        `http://localhost:3000/patients/${patientData.patientID}`,
        patientData
      )
      .then((response) => {
        toast({
          title: "Patient updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        setIsEdit(false);
        // Update the patients state to reflect the changes
        setPatients((prev) =>
          prev.map((patient) =>
            patient.patientID === patientData.patientID ? patientData : patient
          )
        );
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error updating patient",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Box>
      <Heading as="h2" mb={6} textAlign="center">
        Patients Manager
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Select</Th>
            <Th>Patient ID</Th>
            <Th>First Name</Th>
            <Th>Last Name</Th>
            <Th>Email</Th>
            <Th>Actions</Th> {/* Added Actions header */}
          </Tr>
        </Thead>
        <Tbody>
          {patients.map((patient) => (
            <Tr key={patient.patientID}>
              <Td>
                <Checkbox
                  onChange={(e) =>
                    handleCheck(patient.patientID, e.target.checked)
                  }
                />
              </Td>
              <Td>{patient.patientID}</Td>
              <Td>{patient.firstName}</Td>
              <Td>{patient.lastName}</Td>
              <Td>{patient.email || "-"}</Td>
              <Td>
                <Button
                  colorScheme="blue"
                  onClick={() => openEditModal(patient)}
                >
                  Edit
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex justify="center" mt={4}>
        <HStack spacing={4}>
          <Button
            colorScheme="red"
            onClick={deletePatients}
            isDisabled={selectedPatients.length === 0}
          >
            Delete Selected
          </Button>
          <Button colorScheme="green" onClick={onOpen}>
            Add Patient
          </Button>
        </HStack>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? "Edit Patient" : "Add Patient"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="patientID" mb={4}>
              <FormLabel>Patient ID</FormLabel>
              <Input
                type="text"
                name="patientID"
                value={patientData.patientID}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="firstName" mb={4}>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                name="firstName"
                value={patientData.firstName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="lastName" mb={4}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                name="lastName"
                value={patientData.lastName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="dateOfBirth" mb={4}>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                name="dateOfBirth"
                value={patientData.dateOfBirth}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="gender" mb={4}>
              <FormLabel>Gender</FormLabel>
              <Select
                name="gender"
                value={patientData.gender}
                onChange={handleInputChange}
              >
                <option value="Erkek">Erkek</option>
                <option value="Kadın">Kadın</option>
                <option value="Diğer">Diğer</option>
              </Select>
            </FormControl>
            <FormControl id="email" mb={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={patientData.email}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="phoneNumber" mb={4}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="text"
                name="phoneNumber"
                value={patientData.phoneNumber}
                onChange={handleInputChange}
              />
            </FormControl>
            {isEdit ? null : (
              <FormControl id="password" mb={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={patientData.password}
                  onChange={handleInputChange}
                />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={isEdit ? updatePatient : addPatient}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PatientsManager;
