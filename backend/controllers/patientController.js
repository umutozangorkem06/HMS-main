const pool = require("../config/db");
const { patientSchema } = require("../models/patientModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const createPatient = async (req, res) => {
  try {
    const { error } = patientSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      patientID,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phoneNumber,
      password,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let query =
      "INSERT INTO Patients (patientID, firstName, lastName, dateOfBirth, gender, password";
    let values = [
      patientID,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      hashedPassword,
    ];

    if (email) {
      query += ", email";
      values.push(email);
    }
    if (phoneNumber) {
      query += ", phoneNumber";
      values.push(phoneNumber);
    }

    query += ") VALUES (?, ?, ?, ?, ?, ";
    if (email) query += "?, ";
    if (phoneNumber) query += "?, ";
    query += "?)";

    const result = await pool.query(query, values);

    // Create and send the token
    const token = jwt.sign(
      { patientID: result.insertId },
      process.env.TOKEN_SECRET
    );

    res.json({
      message: "Patient created successfully",
      patientID: patientID,
      userType: "Patient",
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.sqlMessage });
  }
};

async function updatePatient(req, res) {
  try {
    const patientID = req.params.id;

    // Fetch the current patient data from the database
    const [patientRows] = await pool.query(
      "SELECT * FROM Patients WHERE patientID = ?",
      [patientID]
    );

    if (patientRows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const currentPatientData = patientRows[0];

    // Merge current data with new data
    const updatedPatientData = {
      firstName: req.body.firstName || currentPatientData.firstName,
      lastName: req.body.lastName || currentPatientData.lastName,
      dateOfBirth: req.body.dateOfBirth || currentPatientData.dateOfBirth,
      gender: req.body.gender || currentPatientData.gender,
      email: req.body.email || currentPatientData.email,
      phoneNumber: req.body.phoneNumber || currentPatientData.phoneNumber,
      password: req.body.password || currentPatientData.password,
    };

    // Update the patient in the database
    await pool.query(
      "UPDATE Patients SET firstName = ?, lastName = ?, dateOfBirth = ?, gender = ?, email = ?, phoneNumber = ?, password = ? WHERE patientID = ?",
      [
        updatedPatientData.firstName,
        updatedPatientData.lastName,
        updatedPatientData.dateOfBirth,
        updatedPatientData.gender,
        updatedPatientData.email,
        updatedPatientData.phoneNumber,
        updatedPatientData.password,
        patientID,
      ]
    );

    res.json({ message: "Patient updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.sqlMessage });
  }
}

async function deletePatient(req, res) {
  try {
    const { id } = req.params;
    // Delete the patient from the database
    await pool.query("DELETE FROM Patients WHERE patientID = ?", [id]);
    res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function getAllPatients(req, res) {
  try {
    const patients = await pool.query("SELECT * FROM Patients");
    res.json(patients[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

const loginPatient = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { patientID, password } = req.body;

    // Check if the patient exists
    const patient = await pool.query(
      "SELECT * FROM Patients WHERE patientID = ?",
      [patientID]
    );

    if (patient[0].length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check if the password is correct
    const validPassword = await bcrypt.compare(
      password,
      patient[0][0].password
    );
    console.log("password inside db: ", patient[0][0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create and assign a token
    const token = jwt.sign(
      { patientID: patient[0][0].patientID },
      process.env.TOKEN_SECRET
    );
    res.header("auth-token", token).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getPatientDetails = async (req, res) => {
  try {
    const { patientID } = req.params;

    const query = `
      SELECT 
        pt.patientID,
        pt.firstName,
        pt.lastName,
        pt.dateOfBirth,
        pt.gender,
        pt.email,
        pt.phoneNumber,
        a.appointmentDate,
        d.firstName AS doctorFirstName,
        d.lastName AS doctorLastName,
        a.appointmentID
      FROM Patients pt
      LEFT JOIN Appointments a ON pt.patientID = a.patientID
      LEFT JOIN Doctors d ON a.doctorID = d.doctorID
      WHERE pt.patientID = ?;
    `;

    const [rows] = await pool.query(query, [patientID]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const patient = {
      patientID: rows[0].patientID,
      firstName: rows[0].firstName,
      lastName: rows[0].lastName,
      dateOfBirth: rows[0].dateOfBirth,
      gender: rows[0].gender,
      email: rows[0].email,
      phoneNumber: rows[0].phoneNumber,
      appointments: rows.map((row) => ({
        appointmentDate: row.appointmentDate,
        doctorFirstName: row.doctorFirstName,
        doctorLastName: row.doctorLastName,
        appointmentID: row.appointmentID,

        appointmentID: row.appointmentID,
      })),
    };

    res.json(patient);
  } catch (err) {
    console.error("Error fetching patient details:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getPatientData = async (req, res) => {
  try {
    const { patientID } = await req.params.id;
    console.log(patientID);
    const query = `
    SELECT 
      a.appointmentDate, 
      d.firstName AS doctorFirstName, 
      d.lastName AS doctorLastName, 
      p.medicationDetails,
      pt.firstName,
      pt.lastName,
      pt.dateOfBirth,
      pt.gender,
      pt.email,
      pt.phoneNumber
    FROM Patients pt
    LEFT JOIN Appointments a ON pt.patientID = a.patientID
    LEFT JOIN Doctors d ON a.doctorID = d.doctorID
    LEFT JOIN Prescriptions p ON a.appointmentID = p.appointmentID
    WHERE pt.patientID = ?;
  `;
    try {
      const [rows] = await pool.query(query, [patientID]);
      res.json(rows);
    } catch (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Server error");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
module.exports = {
  getAllPatients,
  deletePatient,
  updatePatient,
  createPatient,
  loginPatient,
  getPatientData,
  getPatientDetails,
};
