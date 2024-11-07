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

const DoctorsManager = () => {
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorData, setDoctorData] = useState({
    doctorID: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phoneNumber: "",
    password: "",
    departmentID: "",
  });
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/doctors")
      .then((response) => {
        setDoctors(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast({
          title: "Error fetching doctors",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }, [toast]);

  const handleCheck = (doctorID, isChecked) => {
    setSelectedDoctors((prev) =>
      isChecked ? [...prev, doctorID] : prev.filter((id) => id !== doctorID)
    );
  };

  const deleteDoctors = async () => {
    axios
      .all(
        selectedDoctors.map((doctorID) =>
          axios.delete(`http://localhost:3000/doctors/${doctorID}`)
        )
      )
      .then(() => {
        setDoctors((prev) =>
          prev.filter((doctor) => !selectedDoctors.includes(doctor.doctorID))
        );
        setSelectedDoctors([]);
        toast({
          title: "Doctors deleted successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error deleting doctors",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({ ...doctorData, [name]: value });
  };

  const addDoctor = () => {
    const formattedDoctorData = {
      ...doctorData,
      dateOfBirth: new Date(doctorData.dateOfBirth).toISOString().slice(0, 10),
    };

    console.log(formattedDoctorData);
    axios
      .post("http://localhost:3000/doctors", formattedDoctorData)
      .then((response) => {
        toast({
          title: "Doctor added successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        // Update the doctors state to include the new doctor
        setDoctors((prev) => [...prev, response.data]);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error adding doctor",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    setDoctorData([...doctorData, newDoctorData]);
  };

  const openEditModal = (doctor) => {
    setDoctorData({
      doctorID: doctor.doctorID,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      dateOfBirth: new Date(doctor.dateOfBirth).toISOString().slice(0, 10), // format the date
      gender: doctor.gender,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber,
      password: "", // leave password empty for security
      departmentID: doctor.departmentID,
    });
    setIsEdit(true);
    onOpen();
  };

  const updateDoctor = () => {
    axios
      .put(`http://localhost:3000/doctors/${doctorData.doctorID}`, doctorData)
      .then((response) => {
        toast({
          title: "Doctor updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        setIsEdit(false);
        // Update the doctors state to reflect the changes
        setDoctors((prev) =>
          prev.map((doctor) =>
            doctor.doctorID === doctorData.doctorID ? doctorData : doctor
          )
        );
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error updating doctor",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  if (loading) {
    return <Center>Loading...</Center>;
  }

  return (
    <Box>
      <Heading as="h2" mb={6} textAlign="center">
        Doctors Manager
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Select</Th>
            <Th>Doctor ID</Th>
            <Th>Name</Th>
            <Th>Last Name</Th>
            <Th>Email</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {doctors.map((doctor) => (
            <Tr key={doctor.doctorID}>
              <Td>
                <Checkbox
                  onChange={(e) =>
                    handleCheck(doctor.doctorID, e.target.checked)
                  }
                />
              </Td>
              <Td>{doctor.doctorID}</Td>
              <Td>{doctor.firstName}</Td>
              <Td>{doctor.lastName}</Td>
              <Td>{doctor.email || "-"}</Td>
              <Button colorScheme="blue" onClick={() => openEditModal(doctor)}>
                Edit
              </Button>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Box mt={5}>
        <Center>
          <HStack spacing={5}>
            <Button colorScheme="teal" variant="solid" onClick={onOpen}>
              Add
            </Button>
            <Button
              colorScheme="red"
              variant="solid"
              onClick={deleteDoctors}
              isDisabled={selectedDoctors.length === 0}
            >
              Delete Selected
            </Button>
          </HStack>
        </Center>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? "Edit Doctor" : "Add Doctor"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="doctorID" mb={4}>
              <FormLabel>Doctor ID</FormLabel>
              <Input
                type="text"
                name="doctorID"
                value={doctorData.doctorID}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="firstName" mb={4}>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                name="firstName"
                value={doctorData.firstName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="lastName" mb={4}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                name="lastName"
                value={doctorData.lastName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="dateOfBirth" mb={4}>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                name="dateOfBirth"
                value={doctorData.dateOfBirth}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="gender" mb={4}>
              <FormLabel>Gender</FormLabel>
              <Select
                name="gender"
                value={doctorData.gender}
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
                value={doctorData.email}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="phoneNumber" mb={4}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="text"
                name="phoneNumber"
                value={doctorData.phoneNumber}
                onChange={handleInputChange}
              />
            </FormControl>
            {isEdit ? null : (
              <FormControl id="password" mb={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={doctorData.password}
                  onChange={handleInputChange}
                />
              </FormControl>
            )}
            <FormControl id="departmentID" mb={4}>
              <FormLabel>Department ID</FormLabel>
              <Input
                type="text"
                name="departmentID"
                value={doctorData.departmentID}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={isEdit ? updateDoctor : addDoctor}
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

export default DoctorsManager;
