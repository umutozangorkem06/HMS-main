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

const PharmacistsManager = () => {
  const [pharmacists, setPharmacists] = useState([]);
  const [selectedPharmacists, setSelectedPharmacists] = useState([]);
  const [pharmacistData, setPharmacistData] = useState({
    pharmacistID: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/pharmacists")
      .then((response) => {
        setPharmacists(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        toast({
          title: "Error fetching pharmacists",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }, [toast]);

  const handleCheck = (pharmacistID, isChecked) => {
    setSelectedPharmacists((prev) =>
      isChecked
        ? [...prev, pharmacistID]
        : prev.filter((id) => id !== pharmacistID)
    );
  };

  const deletePharmacists = () => {
    axios
      .all(
        selectedPharmacists.map((pharmacistID) =>
          axios.delete(`http://localhost:3000/pharmacists/${pharmacistID}`)
        )
      )
      .then(() => {
        setPharmacists((prev) =>
          prev.filter(
            (pharmacist) =>
              !selectedPharmacists.includes(pharmacist.pharmacistID)
          )
        );
        setSelectedPharmacists([]);
        toast({
          title: "Pharmacists deleted successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error deleting pharmacists",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPharmacistData({ ...pharmacistData, [name]: value });
  };

  const addPharmacist = () => {
    const formattedPharmacistData = {
      ...pharmacistData,
      dateOfBirth: new Date(pharmacistData.dateOfBirth)
        .toISOString()
        .slice(0, 10),
    };

    console.log(formattedPharmacistData);
    axios
      .post("http://localhost:3000/pharmacists", formattedPharmacistData)
      .then((response) => {
        toast({
          title: "Pharmacist added successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        // Update the pharmacists state to include the new pharmacist
        setPharmacists((prev) => [...prev, response.data]);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error adding pharmacist",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    setPharmacistData([...pharmacistData, newPharmacistData]);
  };

  const openEditModal = (pharmacist) => {
    setPharmacistData({
      pharmacistID: pharmacist.pharmacistID,
      firstName: pharmacist.firstName,
      lastName: pharmacist.lastName,
      dateOfBirth: new Date(pharmacist.dateOfBirth).toISOString().slice(0, 10), // format the date
      gender: pharmacist.gender,
      email: pharmacist.email,
      phoneNumber: pharmacist.phoneNumber,
      password: "", // leave password empty for security
    });
    setIsEdit(true);
    onOpen();
  };

  const updatePharmacist = () => {
    axios
      .put(
        `http://localhost:3000/pharmacists/${pharmacistData.pharmacistID}`,
        pharmacistData
      )
      .then((response) => {
        toast({
          title: "Pharmacist updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        setIsEdit(false);
        // Update the pharmacists state to reflect the changes
        setPharmacists((prev) =>
          prev.map((pharmacist) =>
            pharmacist.pharmacistID === pharmacistData.pharmacistID
              ? pharmacistData
              : pharmacist
          )
        );
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Error updating pharmacist",
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
        Pharmacists Manager
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Select</Th>
            <Th>Pharmacist ID</Th>
            <Th>Name</Th>
            <Th>Last Name</Th>
            <Th>Email</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pharmacists.map((pharmacist) => (
            <Tr key={pharmacist.pharmacistID}>
              <Td>
                <Checkbox
                  onChange={(e) =>
                    handleCheck(pharmacist.pharmacistID, e.target.checked)
                  }
                />
              </Td>
              <Td>{pharmacist.pharmacistID}</Td>
              <Td>{pharmacist.firstName}</Td>
              <Td>{pharmacist.lastName}</Td>
              <Td>{pharmacist.email || "-"}</Td>
              <Button
                colorScheme="blue"
                onClick={() => openEditModal(pharmacist)}
              >
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
              onClick={deletePharmacists}
              isDisabled={selectedPharmacists.length === 0}
            >
              Delete Selected
            </Button>
          </HStack>
        </Center>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isEdit ? "Edit Pharmacist" : "Add Pharmacist"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="pharmacistID" mb={4}>
              <FormLabel>Pharmacist ID</FormLabel>
              <Input
                type="text"
                name="pharmacistID"
                value={pharmacistData.pharmacistID}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="firstName" mb={4}>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                name="firstName"
                value={pharmacistData.firstName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="lastName" mb={4}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                name="lastName"
                value={pharmacistData.lastName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="dateOfBirth" mb={4}>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                name="dateOfBirth"
                value={pharmacistData.dateOfBirth}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="gender" mb={4}>
              <FormLabel>Gender</FormLabel>
              <Select
                name="gender"
                value={pharmacistData.gender}
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
                value={pharmacistData.email}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl id="phoneNumber" mb={4}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="text"
                name="phoneNumber"
                value={pharmacistData.phoneNumber}
                onChange={handleInputChange}
              />
            </FormControl>
            {isEdit ? null : (
              <FormControl id="password" mb={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={pharmacistData.password}
                  onChange={handleInputChange}
                />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={isEdit ? updatePharmacist : addPharmacist}
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

export default PharmacistsManager;
