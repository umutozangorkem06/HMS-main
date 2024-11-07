const pool = require("../config/db");
const { doctorSchema } = require("../models/doctorModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function createDoctor(req, res) {
  try {
    const { error } = doctorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const {
      doctorID,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phoneNumber,
      password,
      departmentID,
    } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new doctor into the database
    const result = await pool.query(
      "INSERT INTO Doctors (doctorID, firstName, lastName, dateOfBirth, gender, email, phoneNumber, password, departmentID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        doctorID,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        email,
        phoneNumber,
        hashedPassword,
        departmentID,
      ]
    );
    res.json({
      message: "Doctor created successfully",
      doctorID: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function updateDoctor(req, res) {
  try {
    const doctorID  = req.params.id;

    // Fetch the current doctor data from the database
    const [doctorRows] = await pool.query(
      "SELECT * FROM doctors WHERE doctorID = ?",
      [doctorID]
    );

    if (doctorRows.length === 0) {
      return res.status(404).json({ message: "doctor not found" });
    }

    const currentDoctorData = doctorRows[0];

    // Merge current data with new data
    const updatedDoctorData = {
      firstName: req.body.firstName || currentDoctorData.firstName,
      lastName: req.body.lastName || currentDoctorData.lastName,
      dateOfBirth: req.body.dateOfBirth || currentDoctorData.dateOfBirth,
      gender: req.body.gender || currentDoctorData.gender,
      email: req.body.email || currentDoctorData.email,
      phoneNumber: req.body.phoneNumber || currentDoctorData.phoneNumber,
      password: req.body.password || currentDoctorData.password,
    };

    // Update the doctor in the database
    await pool.query(
      "UPDATE doctors SET firstName = ?, lastName = ?, dateOfBirth = ?, gender = ?, email = ?, phoneNumber = ?, password = ? WHERE doctorID = ?",
      [
        updatedDoctorData.firstName,
        updatedDoctorData.lastName,
        updatedDoctorData.dateOfBirth,
        updatedDoctorData.gender,
        updatedDoctorData.email,
        updatedDoctorData.phoneNumber,
        updatedDoctorData.password,
        doctorID,
      ]
    );

    res.json({ message: "doctor updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function deleteDoctor(req, res) {
  try {
    const { id } = req.params;
    // Delete the doctor from the database
    await pool.query("DELETE FROM Doctors WHERE doctorID = ?", [id]);
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}
async function getAllDoctors(req, res) {
  try {
    const doctors = await pool.query("SELECT * FROM Doctors");
    res.json(doctors[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = { deleteDoctor, updateDoctor, getAllDoctors, createDoctor };
