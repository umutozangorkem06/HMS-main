import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Input,
  Flex,
  Center,
  Text,
  Stack,
  Badge,
  Avatar,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Card,
  CardBody,
  CardHeader,
  Heading,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const PatientMain = () => {
  const [patientData, setPatientData] = useState({
    patientID: localStorage.getItem("userID"),
    fullName: localStorage.getItem("fullName"),
    userType: localStorage.getItem("userType"),
    dateOfBirth: localStorage.getItem("dateOfBirth"),
    gender: localStorage.getItem("gender"),
    phoneNumber: localStorage.getItem("phoneNumber"),
    email: localStorage.getItem("email"),
    medicationDetails: localStorage.getItem("medicationDetails"),
    appointments: null,
  });

  const [doctorData, setDoctorData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [currentDepartmentID, setCurrentDepartmentID] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/patients/${patientData.patientID}`
        );
        const data = response.data;
        setPatientData((prev) => ({
          ...prev,
          fullName: `${data.firstName} ${data.lastName}`,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          phoneNumber: data.phoneNumber,
          email: data.email,
          appointments: data.appointments,
        }));
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching patient:", err);
      }
    };

    const fetchDoctorData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/doctors");
        setDoctorData(response.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };

    const fetchDepartmentData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/departments");
        setDepartmentData(response.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };

    fetchPatientData();
    fetchDoctorData();
    fetchDepartmentData();
  }, []);

  const formik = useFormik({
    initialValues: {
      department: "",
      doctor: "",
      appointmentDate: "",
    },
    validationSchema: Yup.object({
      department: Yup.string().required("Required"),
      doctor: Yup.string().required("Required"),
      appointmentDate: Yup.date().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const selectedDepartment = departmentData.find(
          (department) => department.departmentName === values.department
        );

        const appointmentData = {
          patientID: patientData.patientID,
          doctorID: values.doctor,
          appointmentDate: values.appointmentDate,
          departmentID: selectedDepartment.departmentID,
        };

        await axios.post("http://localhost:3000/appointments", appointmentData);
        resetForm();
        alert("Appointment created successfully");
      } catch (err) {
        console.error("Error while creating appointment", err);
      }
    },
  });

  return (
    <Flex
      mt={16}
      justifyContent="center"
      alignItems="flex-start"
      height="100vh"
    >
      <Box mr={4} width="80%" mt={20}>
        <Center>
          <Card p={6} width="100%" maxWidth="sm" bg="white" boxShadow="lg">
            <CardBody>
              <Center mb={4}>
                <Avatar size="xl" name={patientData.fullName} />
              </Center>
              <Stack spacing={4} textAlign="center">
                <Box>
                  <Text fontSize="2xl" fontWeight="bold">
                    {patientData.fullName}
                  </Text>
                  <Badge mt={1} colorScheme="teal">
                    {patientData.userType}
                  </Badge>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Doğum Tarihi
                  </Text>
                  <Text fontSize="md">
                    {new Date(patientData.dateOfBirth).toLocaleDateString()}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Cinsiyet
                  </Text>
                  <Text fontSize="md">{patientData.gender}</Text>
                </Box>
                {patientData.email && (
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      E-posta
                    </Text>
                    <Text fontSize="md">{patientData.email}</Text>
                  </Box>
                )}
                {patientData.phoneNumber && (
                  <Box>
                    <Text fontSize="sm" color="gray.500">
                      Telefon Numarası
                    </Text>
                    <Text fontSize="md">{patientData.phoneNumber}</Text>
                  </Box>
                )}
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    İlaç Detayları
                  </Text>
                  <Text fontSize="md">{patientData.medicationDetails}</Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </Center>

        <Card mt={8} p={6} bg="white" boxShadow="lg">
          <CardHeader>
            <Heading size="md">Patient Appointments</Heading>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table variant="striped" colorScheme="teal">
                <TableCaption>Patient Appointments</TableCaption>
                <Thead>
                  <Tr>
                    <Th>Appointment Date</Th>
                    <Th>Doktor Ad</Th>
                    <Th>Doktor Soyad</Th>
                    <Th>Sıra Numarası</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {patientData.appointments?.map((appointment) => (
                    <Tr key={appointment.appointmentDate}>
                      <Td>
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString()}
                      </Td>

                      <Td>{appointment.doctorFirstName}</Td>
                      <Td>{appointment.doctorLastName}</Td>
                      <Td>{appointment.appointmentID || "N/A"}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
        <Card mt={8} p={6} bg="white" boxShadow="lg">
          <CardHeader>
            <Heading size="md">Create Appointment</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={formik.handleSubmit}>
              <FormControl
                isInvalid={
                  formik.errors.department && formik.touched.department
                }
                mb={4}
              >
                <FormLabel>Department</FormLabel>
                <Select
                  name="department"
                  onChange={(e) => {
                    formik.handleChange(e);
                    formik.setFieldValue("doctor", "");
                    const selectedDepartment = departmentData.find(
                      (department) =>
                        department.departmentName === e.target.value
                    );
                    setCurrentDepartmentID(
                      selectedDepartment?.departmentID || null
                    );
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.department}
                >
                  <option value="" label="Select department" />
                  {departmentData.map((department) => (
                    <option
                      key={department.departmentID}
                      value={department.departmentName}
                    >
                      {department.departmentName}
                    </option>
                  ))}
                </Select>
                {formik.touched.department && formik.errors.department ? (
                  <Text color="red.500">{formik.errors.department}</Text>
                ) : null}
              </FormControl>

              <FormControl
                isInvalid={formik.errors.doctor && formik.touched.doctor}
                mb={4}
              >
                <FormLabel>Doctor</FormLabel>
                <Select
                  name="doctor"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.doctor}
                  disabled={!formik.values.department}
                >
                  <option value="" label="Select doctor" />
                  {doctorData
                    .filter(
                      (doctor) => doctor.departmentID === currentDepartmentID
                    )
                    .map((doctor) => (
                      <option key={doctor.doctorID} value={doctor.doctorID}>
                        {doctor.firstName} {doctor.lastName}
                      </option>
                    ))}
                </Select>
                {formik.touched.doctor && formik.errors.doctor ? (
                  <Text color="red.500">{formik.errors.doctor}</Text>
                ) : null}
              </FormControl>

              <FormControl
                isInvalid={
                  formik.errors.appointmentDate &&
                  formik.touched.appointmentDate
                }
                mb={4}
              >
                <FormLabel>Appointment Date</FormLabel>
                <Input
                  type="date"
                  name="appointmentDate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.appointmentDate}
                />
                {formik.touched.appointmentDate &&
                formik.errors.appointmentDate ? (
                  <Text color="red.500">{formik.errors.appointmentDate}</Text>
                ) : null}
              </FormControl>

              <Button type="submit" colorScheme="teal" mt={4}>
                Create Appointment
              </Button>
            </form>
          </CardBody>
        </Card>
      </Box>
    </Flex>
  );
};

export default PatientMain;
