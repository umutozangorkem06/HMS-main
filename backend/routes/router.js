const {
  getAllPatients,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientData,
  getPatientDetails,
} = require("../controllers/patientController");
const {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentData,
} = require("../controllers/appointmentController");
const {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");
const {
  getAllPrescriptions,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getPrescriptionById,
} = require("../controllers/prescriptionController");
const {
  getAllDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorContoller");

const {
  getAllPharmacists,
  createPharmacist,
  updatePharmacist,
  deletePharmacist,
} = require("../controllers/pharmacistController");
const { loginUser } = require("../controllers/loginController");

const express = require("express");
const router = express.Router();

//login process
router.post("/login", loginUser);

// Patients routes
router.get("/patients", getAllPatients);
router.post("/patients", createPatient);
router.put("/patients/:id", updatePatient);
router.delete("/patients/:id", deletePatient);
router.get("/patients/:patientID", getPatientDetails);

// Doctors routes
router.get("/doctors", getAllDoctors);
router.post("/doctors", createDoctor);
router.put("/doctors/:id", updateDoctor);
router.delete("/doctors/:id", deleteDoctor);

// Appointments routes
router.get("/appointments", getAllAppointments);
router.post("/appointments", createAppointment);
router.put("/appointments/:id", updateAppointment);
router.delete("/appointments/:id", deleteAppointment);
router.get("/appointments/:id", getAppointmentData);

// Departments routes
router.get("/departments", getAllDepartments);
router.post("/departments", createDepartment);
router.put("/departments/:id", updateDepartment);
router.delete("/departments/:id", deleteDepartment);

// Prescriptions routes
router.get("/prescriptions", getAllPrescriptions);
router.post("/prescriptions", createPrescription);
router.put("/prescriptions/:id", updatePrescription);
router.delete("/prescriptions/:id", deletePrescription);

router.get("/pharmacists", getAllPharmacists);
router.post("/pharmacists", createPharmacist);
router.put("/pharmacists/:id", updatePharmacist);
router.delete("/pharmacists/:id", deletePharmacist);
router.get("/pharmacists/:id", getPrescriptionById);

module.exports = router;
