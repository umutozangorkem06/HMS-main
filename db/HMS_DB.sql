DROP DATABASE IF EXISTS hms;
CREATE DATABASE hms;
USE hms;

CREATE TABLE Patients (
    patientID VARCHAR(11) PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    dateOfBirth DATE NOT NULL,
    gender ENUM('Erkek', 'Kadın', 'Diğer') NOT NULL,
    email VARCHAR(255) UNIQUE,
    phoneNumber VARCHAR(14) UNIQUE,
    password VARCHAR(255) NOT NULL
);
CREATE TABLE Departments (
    departmentID INT AUTO_INCREMENT PRIMARY KEY,
    departmentName VARCHAR(255) UNIQUE NOT NULL
);
CREATE TABLE Doctors (
    doctorID VARCHAR(11) PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    dateOfBirth DATE NOT NULL,
    gender ENUM('Erkek', 'Kadın', 'Diğer') NOT NULL,
    email VARCHAR(255) UNIQUE,
    phoneNumber VARCHAR(14) UNIQUE,
    password VARCHAR(255) NOT NULL,
    departmentID INT,
    FOREIGN KEY (departmentID) REFERENCES Departments(departmentID)
);
CREATE TABLE Pharmacists (
    pharmacistID VARCHAR(11) PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    dateOfBirth DATE NOT NULL,
    gender ENUM('Erkek', 'Kadın', 'Diğer') NOT NULL,
    email VARCHAR(255) UNIQUE,
    phoneNumber VARCHAR(14) UNIQUE,
    password VARCHAR(255) NOT NULL
);


CREATE TABLE Appointments (
    appointmentID INT AUTO_INCREMENT PRIMARY KEY,
    appointmentDate DATE,
    patientID VARCHAR(11),
    doctorID VARCHAR(11),
    departmentID INT,
    FOREIGN KEY (patientID) REFERENCES Patients(patientID) ON DELETE CASCADE,
    FOREIGN KEY (doctorID) REFERENCES Doctors(doctorID) ON DELETE CASCADE,
    FOREIGN KEY (departmentID) REFERENCES Departments(departmentID) 
);


CREATE TABLE Prescriptions (
    prescriptionID VARCHAR(5) PRIMARY KEY,
    appointmentID INT,
    patientID VARCHAR(11),
    doctorID VARCHAR(11),
    pharmacistID VARCHAR(11),
    prescriptionDate DATE,
    medicationDetails VARCHAR(255),
    FOREIGN KEY (appointmentID) REFERENCES Appointments(appointmentID) ON DELETE CASCADE,
    FOREIGN KEY (pharmacistID) REFERENCES Pharmacists(pharmacistID) ON DELETE CASCADE,
    FOREIGN KEY (doctorID) REFERENCES Doctors(doctorID) ON DELETE CASCADE,
    FOREIGN KEY (patientID) REFERENCES Patients(patientID) ON DELETE CASCADE
);




-- Patients
INSERT INTO Patients (patientID, firstName, lastName, dateOfBirth, gender, email, phoneNumber, password) VALUES
('98765432109', 'Aylin', 'Şahin', '1990-02-18', 'Kadın', 'aylin.sahin@example.com', '5559876543', 'password123'),
('87654321098', 'Ali', 'Demir', '1985-07-22', 'Erkek', 'ali.demir@example.com', '5558765432', 'password123'),
('76543210987', 'Zeynep', 'Kaya', '1979-04-30', 'Kadın', 'zeynep.kaya@example.com', '5557654321', 'password123'),
('65432109876', 'Hakan', 'Yılmaz', '1987-10-12', 'Erkek', 'hakan.yilmaz@example.com', '5556543210', 'password123'),
('54321098765', 'Esra', 'Öztürk', '1983-01-07', 'Kadın', 'esra.ozturk@example.com', '5555432109', 'password123');

-- Pharmacists
INSERT INTO Pharmacists (pharmacistID, firstName, lastName, dateOfBirth, gender, email, phoneNumber, password) VALUES
('10987654321', 'Deniz', 'Korkmaz', '1974-09-08', 'Kadın', 'deniz.korkmaz@example.com', '5551098765', 'password123'),
('21098765432', 'Emre', 'Sarı', '1986-11-25', 'Erkek', 'emre.sari@example.com', '5552109876', 'password123'),
('32109876543', 'Begüm', 'Tunç', '1980-06-14', 'Kadın', 'begum.tunc@example.com', '5553210987', 'password123'),
('43210987654', 'Can', 'Yıldız', '1978-03-03', 'Erkek', 'can.yildiz@example.com', '5554321098', 'password123'),
('54321098765', 'Aysun', 'Güneş', '1982-12-20', 'Kadın', 'aysun.gunes@example.com', '5555432109', 'password123');

-- Insert Turkish departments
INSERT INTO
    Departments (departmentName)
VALUES
	('Dahiliye'),
    ('Cerrahi'),
    ('Kadın Hastalıkları ve Doğum'),
    ('Çocuk Sağlığı ve Hastalıkları'),
    ('Göz Hastalıkları'),
    ('Kardiyoloji');

-- Doctors
INSERT INTO Doctors (doctorID, firstName, lastName, dateOfBirth, gender, email, phoneNumber, password, departmentID) VALUES
('12345678901', 'Ahmet', 'Yılmaz', '1980-05-15', 'Erkek', 'ahmet.yilmaz@example.com', '5551234567', 'password123', 1),
('23456789012', 'Ayşe', 'Kaya', '1975-08-20', 'Kadın', 'ayse.kaya@example.com', '5552345678', 'password123', 2),
('34567890123', 'Mehmet', 'Çelik', '1982-03-10', 'Erkek', 'mehmet.celik@example.com', '5553456789', 'password123', 3),
('45678901234', 'Fatma', 'Demir', '1988-12-05', 'Kadın', 'fatma.demir@example.com', '5554567890', 'password123', 1),
('56789012345', 'Mustafa', 'Kurt', '1970-06-25', 'Erkek', 'mustafa.kurt@example.com', '5555678901', 'password123', 2);

-- Appointments
INSERT INTO Appointments (appointmentDate, patientID, doctorID, departmentID)
VALUES
('2024-06-01', '98765432109', '12345678901', 1),
('2024-06-02', '87654321098', '23456789012', 2),
('2024-06-03', '76543210987', '34567890123', 3),
('2024-06-04', '65432109876', '45678901234', 1),
('2024-06-05', '54321098765', '56789012345', 2);

-- Prescriptions
INSERT INTO Prescriptions (prescriptionID, appointmentID, patientID, doctorID, pharmacistID, prescriptionDate, medicationDetails)
VALUES
('P001', 1, '98765432109', '12345678901', '10987654321', '2024-06-01', 'Parol, Neoral'),
('P002', 2, '87654321098', '23456789012', '21098765432', '2024-06-02', 'Augmentin, Dolorex'),
('P003', 3, '76543210987', '34567890123', '32109876543', '2024-06-03', 'Pantoloc, Bepanthol'),
('P004', 4, '65432109876', '45678901234', '43210987654', '2024-06-04', 'Nebilet, Vermidon'),
('P005', 5, '54321098765', '56789012345', '54321098765', '2024-06-05', 'Bromhexin, Buscopan');


-- INSERT INTO Appointments (PatientID, DoctorID, DepartmentID, AppointmentDate)
-- VALUES ('a11450f5-dcd5-11ee-a372-4ccc6a43e5c9', '2', '1', '2024-03-07');
SELECT
    *
FROM
    Patients;

SELECT
    *
FROM
    Doctors;

SELECT
    *
FROM
    Departments;

SELECT
    *
FROM
    Appointments;

SELECT
    *
FROM
    Prescriptions;

SELECT
    *
FROM
    Pharmacists;

-- VIEWS
CREATE VIEW PatientInformation AS
SELECT
    p.patientID,
    p.firstName,
    p.lastName,
    p.dateOfBirth,
    p.gender,
    p.email,
    p.phoneNumber,
    d.doctorID,
    CONCAT(d.firstName, ' ', d.lastName) AS doctorName,
    a.appointmentDate
FROM
    Patients p
    LEFT JOIN Appointments a ON p.patientID = a.patientID
    LEFT JOIN Doctors d ON a.doctorID = d.doctorID;

CREATE VIEW PrescriptionDetails AS
SELECT
    pr.prescriptionID,
    pr.medicationDetails,
    pr.prescriptionDate,
    p.patientID,
    CONCAT(p.firstName, ' ', p.lastName) AS patientName,
    d.doctorID,
    CONCAT(d.firstName, ' ', d.lastName) AS doctorName
FROM
    Prescriptions pr
    JOIN Patients p ON pr.patientID = p.patientID
    JOIN Doctors d ON pr.doctorID = d.doctorID 
    -- TRIGGER
DELIMITER //
CREATE TRIGGER log_prescription_changes
AFTER UPDATE ON Prescriptions
FOR EACH ROW
BEGIN
    INSERT INTO PrescriptionChanges (prescriptionID, medicationDetails, changeDate)
    VALUES (OLD.prescriptionID, OLD.medicationDetails, NOW());
END;
//
DELIMITER ;

-- Assertion to ensure appointment date
DELIMITER //
CREATE ASSERTION APPOINTMENT_DATE_CHECK
CHECK (
-- Check if appointment date is in the future relative to the current date
appointmentDate > CURDATE()
);
DELIMITER ;
/*
DELIMITER //
CREATE TRIGGER check_appointment_date
BEFORE INSERT ON Appointments
FOR EACH ROW
BEGIN
    IF NEW.appointmentDate <= CURDATE() THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Appointment date must be in the future';
    END IF;
END;
//
DELIMITER ;
*/

