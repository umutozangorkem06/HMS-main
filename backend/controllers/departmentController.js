const pool = require("../config/db.js");
const Joi = require("joi");
const { departmentSchema } = require("../models/departmentModel");

async function getAllDepartments(req, res) {
  try {
    const [departments] = await pool.query("SELECT * FROM Departments");
    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function getDepartmentById(req, res) {
  try {
    const { id } = req.params;
    const [department] = await pool.query(
      "SELECT * FROM Departments WHERE departmentID = ?",
      [id]
    );
    if (department.length === 0) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json(department[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function createDepartment(req, res) {
  try {
    const { error } = departmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { departmentName } = req.body;
    const result = await pool.query(
      "INSERT INTO Departments (departmentName) VALUES (?)",
      [departmentName]
    );
    res.json({
      message: "Department created successfully",
      departmentID: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function updateDepartment(req, res) {
  try {
    const { id } = req.params;
    const { error } = departmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { departmentName } = req.body;
    await pool.query(
      "UPDATE Departments SET departmentName = ? WHERE departmentID = ?",
      [departmentName, id]
    );
    res.json({ message: "Department updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

async function deleteDepartment(req, res) {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM Departments WHERE departmentID = ?", [id]);
    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
