const pool = require("../config/db");
const { pharmacistSchema } = require("../models/pharmacistModel");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const saltRounds = 10;

async function createPharmacist(req, res) {
  try {
    const { error } = pharmacistSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const {
      pharmacistID,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phoneNumber,
      password,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Insert new pharmacist into the database
    let query =
      "INSERT INTO Pharmacists (pharmacistID, firstName, lastName, dateOfBirth, gender, email, phoneNumber, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    let values = [
      pharmacistID,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phoneNumber,
      hashedPassword,
    ];

    const result = await pool.query(query, values);

    // Create and send the token
    const token = jwt.sign(
      { pharmacistID: result.insertId },
      process.env.TOKEN_SECRET
    );

    res.json({
      message: "Pharmacist created successfully",
      pharmacistID: pharmacistID,
      userType: "Pharmacist",
      token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function updatePharmacist(req, res) {
  try {
    const  pharmacistID  = req.params.id;

    // Fetch the current pharmacist data from the database
    const [pharmacistRows] = await pool.query(
      "SELECT * FROM pharmacists WHERE pharmacistID = ?",
      [pharmacistID]
    );

    if (pharmacistRows.length === 0) {
      return res.status(404).json({ message: "pharmacist not found" });
    }

    const currentPharmacistData = pharmacistRows[0];

    // Merge current data with new data
    const updatedPharmacistData = {
      firstName: req.body.firstName || currentPharmacistData.firstName,
      lastName: req.body.lastName || currentPharmacistData.lastName,
      dateOfBirth: req.body.dateOfBirth || currentPharmacistData.dateOfBirth,
      gender: req.body.gender || currentPharmacistData.gender,
      email: req.body.email || currentPharmacistData.email,
      phoneNumber: req.body.phoneNumber || currentPharmacistData.phoneNumber,
      password: req.body.password || currentPharmacistData.password,
    };

    // Update the pharmacist in the database
    // Update the pharmacist in the database
    await pool.query(
      "UPDATE pharmacists SET firstName = ?, lastName = ?, dateOfBirth = ?, gender = ?, email = ?, phoneNumber = ?, password = ? WHERE pharmacistID = ?",
      [
        updatedPharmacistData.firstName,
        updatedPharmacistData.lastName,
        updatedPharmacistData.dateOfBirth,
        updatedPharmacistData.gender,
        updatedPharmacistData.email,
        updatedPharmacistData.phoneNumber,
        updatedPharmacistData.password,
        pharmacistID,
      ]
    );
    res.json({ message: "doctor updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}
async function deletePharmacist(req, res) {
  try {
    const { id } = req.params;
    // Delete the pharmacist from the database
    await pool.query("DELETE FROM Pharmacists WHERE pharmacistID = ?", [id]);
    res.json({ message: "Pharmacist deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function getAllPharmacists(req, res) {
  try {
    const pharmacists = await pool.query("SELECT * FROM Pharmacists");
    res.json(pharmacists[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  getAllPharmacists,
  updatePharmacist,
  deletePharmacist,
  createPharmacist,
};
