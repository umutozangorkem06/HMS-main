const pool = require("../config/db.js");
const Joi = require("joi");

const prescriptionSchema = Joi.object({
  prescriptionID: Joi.string().required(),
  appointmentID: Joi.number().required(),
  patientID: Joi.string().required(),
  doctorID: Joi.string().required(),
  pharmacistID: Joi.string().required(),
  prescriptionDate: Joi.date().required(),
  medicationDetails: Joi.string().required(),
});

async function getAllPrescriptions(req, res) {
  try {
    const [prescriptions] = await pool.query("SELECT * FROM Prescriptions");
    res.json(prescriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function getPrescriptionById(req, res) {
  try {
    const { id } = req.params;
    const [prescription] = await pool.query(
      "SELECT * FROM Prescriptions WHERE pharmacistID = ?",
      [id]
    );
    if (prescription.length === 0) {
      return res.status(404).json({ message: "Prescription not found" });
    }
    res.json(prescription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function createPrescription(req, res) {
  try {
    const { error } = prescriptionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const {
      prescriptionID,
      patientID,
      doctorID,
      appointmentID,
      pharmacistID,
      prescriptionDate,
      medicationDetails,
    } = req.body;
    const result = await pool.query(
      "INSERT INTO Prescriptions (prescriptionID, patientID, doctorID, appointmentID, pharmacistID, prescriptionDate, medicationDetails) VALUES (?,?, ?, ?, ?, ?, ?)",
      [
        prescriptionID,
        patientID,
        doctorID,
        appointmentID,
        pharmacistID,
        prescriptionDate,
        medicationDetails,
      ]
    );
    res.json({
      message: "Prescription created successfully",
      prescriptionID: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function updatePrescription(req, res) {
  try {
    const { id } = req.params;
    const { error } = prescriptionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { appointmentID, pharmacistID, prescriptionDate, medicationDetails } =
      req.body;
    await pool.query(
      "UPDATE Prescriptions SET appointmentID = ?, pharmacistID = ?, prescriptionDate = ?, medicationDetails = ? WHERE prescriptionID = ?",
      [appointmentID, pharmacistID, prescriptionDate, medicationDetails, id]
    );
    res.json({ message: "Prescription updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function deletePrescription(req, res) {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Prescriptions WHERE prescriptionID = ?", [
      id,
    ]);
    res.json({ message: "Prescription deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
};
