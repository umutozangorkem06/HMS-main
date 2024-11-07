import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Input,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateAppointmentForm = ({ doctors, onSubmit }) => {
  const [appointmentData, setAppointmentData] = useState({
    appointmentDate: "",
    doctorFirstName: "",
    doctorLastName: "",
    departmentID: "",
  });
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const createAppointment = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/appointments",
        data
      );
      // Handle the response if needed
      console.log("Appointment created successfully:", response.data);
    } catch (err) {
      console.error("Error while creating appointment:", err);
    }
  };

  const handleSubmit = (e) => {
    // e.preventDefault();
    console.log(selectedDoctor);
    const selectedDoc = doctors.find(
      (doc) => doc.firstName + " " + doc.lastName === selectedDoctor
    );
    console.log(selectedDoc);
    if (selectedDoc) {
      const data = {
        doctorID: selectedDoc.doctorID,
        patientID: localStorage.getItem("userID"),
        appointmentDate: selectedDate,
        departmentID: selectedDoc.departmentID,
      };
      createAppointment(data);
    } else {
      console.error("Selected doctor not found");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl id="doctor-select">
        <FormLabel>Select a doctor</FormLabel>
        <Select
          placeholder="Select doctor"
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
        >
          {doctors.map((doctor, index) => (
            <option key={index} value={doctor.id}>
              {doctor.firstName} {doctor.lastName}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl id="date-select" mt={4}>
        <FormLabel>Select date and time</FormLabel>
        <Input
          type="datetime-local"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </FormControl>
      <Box mt={4}>
        <Button type="submit">Randevu Oluştur</Button>
      </Box>
    </form>
  );
};

export default CreateAppointmentForm;
