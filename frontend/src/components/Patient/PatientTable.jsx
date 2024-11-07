import React from "react";

const PatientTable = ({}) => {
  return (
    <Flex>
      <Box mt={16}>
        <TableContainer>
          <Table variant="striped" colorScheme="teal">
            <TableCaption>Patient Appointments</TableCaption>
            <Thead>
              <Tr>
                <Th>Appointment Date</Th>
                <Th>Doctor Name</Th>
              </Tr>
            </Thead>
            <Tbody>
              {appointments.map((appointment, index) => (
                <Tr key={index}>
                  <Td>{appointment.appointmentDate}</Td>
                  <Td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Flex>
  );
};

export default PatientTable;
