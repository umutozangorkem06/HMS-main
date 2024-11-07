const pool = require("../config/db.js");
const Joi = require("joi");

const appointmentSchema = Joi.object({
  patientID: Joi.number().integer().required(),
  doctorID: Joi.number().integer().required(),
  appointmentDate: Joi.date().required(),
  departmentID: Joi.number().integer().required(),
});

async function getAllAppointments(req, res) {
  try {
    const [appointments] = await pool.query("SELECT * FROM Appointments");
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function getAppointmentById(req, res) {
  try {
    const { id } = req.params;
    const [appointment] = await pool.query(
      "SELECT * FROM Appointments WHERE appointmentID = ?",
      [id]
    );
    if (appointment.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function createAppointment(req, res) {
  try {
    const { error } = appointmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { patientID, doctorID, appointmentDate, departmentID } = req.body;
    const result = await pool.query(
      "INSERT INTO Appointments (patientID, doctorID, appointmentDate, departmentID) VALUES (?, ?, ?, ?)",
      [patientID, doctorID, appointmentDate, departmentID]
    );
    res.json({
      message: "Appointment created successfully",
      appointmentID: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function updateAppointment(req, res) {
  try {
    const { id } = req.params;
    const { error } = appointmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { patientID, doctorID, appointmentDate, departmentID } = req.body;
    await pool.query(
      "UPDATE Appointments SET patientID = ?, doctorID = ?, appointmentDate = ?, departmentID = ? WHERE appointmentID = ?",
      [patientID, doctorID, appointmentDate, departmentID, id]
    );
    res.json({ message: "Appointment updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function deleteAppointment(req, res) {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Appointments WHERE appointmentID = ?", [id]);
    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function getAppointmentData(req, res) {
  try {
    const { id } = req.params;
    const [appointment] = await pool.query(
      "SELECT * FROM Appointments WHERE patientID = ?",
      [id]
    );
    if (appointment.length === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentData,
};
