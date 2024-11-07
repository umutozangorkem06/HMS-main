const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const loginUser = async (req, res) => {
  console.log("LOGIN USER WORKS");
  const { id, password } = await req.body;

  console.log("Checking database for user with ID:", id);

  try {
    let fullName;
    let userType;
    let userID;

    // PATIENT CHECK
    const [patientRows] = await pool.query(
      "SELECT patientID, firstName, lastName, password FROM Patients WHERE patientID = ?",
      [id]
    );

    if (patientRows.length > 0) {
      const patient = patientRows[0];
      const dbPatientId = patient.patientID;
      if (id === dbPatientId) {
        userType = "Patient";
        fullName = `${patient.firstName} ${patient.lastName}`;
        userID = patient.patientID;
        const hashedPassword = patient.password;

        const passwordMatch = await bcrypt.compare(password, hashedPassword);
        if (passwordMatch) {
          console.log("Password matched");

          // Create and send the token
          const token = jwt.sign(
            { patientID: userID },
            process.env.TOKEN_SECRET
          );

          return res.json({
            message: "Patient logged in successfully",
            userID: userID,
            userType: userType,
            fullName: fullName,
            token: token,
          });
        } else {
          console.log("Password not matched");
        }
      }
    }

    // DOCTOR CHECK
    const [doctorRows] = await pool.query(
      "SELECT doctorID, firstName, lastName, password FROM Doctors WHERE doctorID = ?",
      [id]
    );

    if (doctorRows.length > 0) {
      const doctor = doctorRows[0];
      const dbDoctorId = doctor.doctorID;
      if (id === dbDoctorId) {
        userType = "Doctor";
        fullName = `${doctor.firstName} ${doctor.lastName}`;
        userID = doctor.doctorID;
        const hashedPassword = doctor.password;

        const passwordMatch = await bcrypt.compare(password, hashedPassword);
        if (passwordMatch) {
          console.log("Password matched");

          // Create and send the token
          const token = jwt.sign(
            { doctorID: userID },
            process.env.TOKEN_SECRET
          );

          return res.json({
            message: "Doctor logged in successfully",
            userID: userID,
            userType: userType,
            fullName: fullName,
            token: token,
          });
        } else {
          console.log("Password not matched");
        }
      }
    }

    // PHARMACIST CHECK
    const [pharmacistRows] = await pool.query(
      "SELECT pharmacistID, firstName, lastName, password FROM Pharmacists WHERE pharmacistID = ?",
      [id]
    );

    if (pharmacistRows.length > 0) {
      const pharmacist = pharmacistRows[0];
      const dbPharmacistId = pharmacist.pharmacistID;
      if (id === dbPharmacistId) {
        userType = "Pharmacist";
        fullName = `${pharmacist.firstName} ${pharmacist.lastName}`;
        userID = pharmacist.pharmacistID;
        const hashedPassword = pharmacist.password;

        const passwordMatch = await bcrypt.compare(password, hashedPassword);
        if (passwordMatch) {
          console.log("Password matched");

          // Create and send the token
          const token = jwt.sign(
            { pharmacistID: userID },
            process.env.TOKEN_SECRET
          );

          return res.json({
            message: "Pharmacist logged in successfully",
            userID: userID,
            userType: userType,
            fullName: fullName,
            token: token,
          });
        } else {
          console.log("Password not matched");
        }
      }
    }
    //ADMIN CHECK
    if (id === "10000000000" && password === "admin") {
      userType = "Admin";
      fullName = "Admin";
      userID = "admin";
      const token = jwt.sign({ adminID: userID }, process.env.TOKEN_SECRET);
      return res.status(200).json({
        message: "HOJGELDINIZ ADMIN BEĞ",
        userID: userID,
        userType: userType,
        fullName: fullName,
        token: token,
      });
    }

    console.log("User not found");
    return res.status(404).json({
      message: "User not found",
    });
  } catch (error) {
    console.error("Error logging in user: ", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = { loginUser };
