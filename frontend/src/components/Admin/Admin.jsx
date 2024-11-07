import React, { useState } from "react";
import { Box, Heading, Flex, Button } from "@chakra-ui/react";
import PatientsManager from "./PatientsManager";
import DoctorsManager from "./DoctorsManager";
import PharmacistsManager from "./PharmacistsManager";

const Admin = () => {
  const [currentManager, setCurrentManager] = useState("PatientsManager");

  const managerComponents = {
    PatientsManager: <PatientsManager />,
    DoctorsManager: <DoctorsManager />,
    PharmacistsManager: <PharmacistsManager />,
  };

  return (
    <Box height="100vh" p={0}>
      <Heading as="h1" mb={4} textAlign="center">
        Admin Panel
      </Heading>
      <Flex height="calc(100vh - 60px)" justify="center" align="center">
        <Box>
          <Flex justify="center" gap={6} mb={8}>
            {["PatientsManager", "DoctorsManager", "PharmacistsManager"].map(
              (manager) => (
                <Box p={4} bg="gray.100" borderRadius="md" key={manager}>
                  <Button
                    colorScheme="blue"
                    w="100%"
                    onClick={() => setCurrentManager(manager)}
                  >
                    {`Manage ${manager.replace("Manager", "")}`}
                  </Button>
                </Box>
              )
            )}
          </Flex>
          <Box>{managerComponents[currentManager]}</Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default Admin;
