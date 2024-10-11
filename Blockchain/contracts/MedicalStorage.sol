// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MedicalStorage {
    struct Patient {
        string name;
        string phone;
        uint256 age;
        string gender;
        string height;
        string weight;
        string bloodType;
        string allergies;
        string problem;
        address[] doctors;
        mapping(address => Diagnosis) doctorDiagnoses;
    }

    struct Doctor {
        string name;
        string phone;
        string gender;
        string qualification;
        string major;
        string details;
        address[] patientsList;
    }

    struct Diagnosis {
        string diagnosis;
        string medicineInformation;
    }

    uint256 totalNumberOfDoctors;
    uint256 totalNumberOfPatients;
    address[] doctorsList;
    address[] patientsList;
    mapping(address => Patient) private patients;
    mapping(address => Doctor) private doctors;

    // Events
    event MedicalStorage__RegisterDoctor(string name, string details);
    event MedicalStorage__AddPatient(string name, uint256 age, string problem);
    event MedicalStorage__AddDoctor(address indexed patient, address indexed doctor);
    event MedicalStorage__RevokeDoctorAccess(address indexed patient, address indexed doctor);
    event MedicalStorage__ProvideDiagnosis(address indexed patient, address indexed doctor, string diagnosis, string medicineInformation);

    // Doctor registration function
    function registerDoctor(
        string memory _name,
        string memory _phone,
        string memory _gender,
        string memory _qualification,
        string memory _major,
        string memory _details
    ) public {
        totalNumberOfDoctors++;
        doctors[msg.sender].name = _name;
        doctors[msg.sender].phone = _phone;
        doctors[msg.sender].gender = _gender;
        doctors[msg.sender].qualification = _qualification;
        doctors[msg.sender].major = _major;
        doctors[msg.sender].details = _details;
        doctorsList.push(msg.sender);
        emit MedicalStorage__RegisterDoctor(_name, _details);
    }

    // Patient registration function
    function addPatient(
        string memory _name,
        string memory _phone,
        uint256 _age,
        string memory _gender,
        string memory _height,
        string memory _weight,
        string memory _bloodType,
        string memory _allergies,
        string memory _problem
    ) public {
        totalNumberOfPatients++;
        patients[msg.sender].name = _name;
        patients[msg.sender].phone = _phone;
        patients[msg.sender].age = _age;
        patients[msg.sender].gender = _gender;
        patients[msg.sender].height = _height;
        patients[msg.sender].weight = _weight;
        patients[msg.sender].bloodType = _bloodType;
        patients[msg.sender].allergies = _allergies;
        patients[msg.sender].problem = _problem;
        patientsList.push(msg.sender);
        emit MedicalStorage__AddPatient(_name, _age, _problem);
    }

    // Add doctor to patient's list
    function addDoctor(address _doctorAddress) public {
        require(patients[msg.sender].doctors.length < 5, "Maximum number of doctors reached.");
        require(msg.sender != _doctorAddress, "The patient address cannot be equal to the doctors address");
        require(!checkDoctorAlreadyExists(msg.sender, _doctorAddress), "Doctor already exists in your list");
        patients[msg.sender].doctors.push(_doctorAddress);
        Doctor storage doctor = doctors[_doctorAddress];
        doctor.patientsList.push(msg.sender);
        emit MedicalStorage__AddDoctor(msg.sender, _doctorAddress);
    }

    // Revoke doctor access from patient's list
    function revokeDoctorAccess(address _doctorAddress) public {
        int256 indexDoctor = findDoctorIndex(msg.sender, _doctorAddress);
        int256 indexPatient = findPatientIndex(msg.sender, _doctorAddress);
        require(checkDoctorAlreadyExists(msg.sender, _doctorAddress), "Doctor not found");
        require(checkPatientAlreadyExists(msg.sender, _doctorAddress), "Patient not found");

        // Remove the doctor from the patient's list of doctors
        uint256 unsignedIndex = uint256(indexDoctor);
        address[] storage doctorList = patients[msg.sender].doctors;
        doctorList[unsignedIndex] = doctorList[doctorList.length - 1];
        doctorList.pop();

        // Remove the patient from the doctor's list of patients
        unsignedIndex = uint256(indexPatient);
        address[] storage patientList = doctors[_doctorAddress].patientsList;
        patientList[unsignedIndex] = patientList[patientList.length - 1];
        patientList.pop();

        // Delete the diagnosis information associated with the doctor
        delete patients[msg.sender].doctorDiagnoses[_doctorAddress];
        emit MedicalStorage__RevokeDoctorAccess(msg.sender, _doctorAddress);
    }

    // Provide diagnosis to patient
    function provideDiagnosis(
        address _patientAddress,
        string memory _diagnosis,
        string memory _medicineInformation
    ) public {
        require(checkDoctorAlreadyExists(_patientAddress, msg.sender), "Doctor not authorized.");
        patients[_patientAddress].doctorDiagnoses[msg.sender] = Diagnosis(
            _diagnosis,
            _medicineInformation
        );
        emit MedicalStorage__ProvideDiagnosis(_patientAddress, msg.sender, _diagnosis, _medicineInformation);
    }

    // Utility functions for finding indices and checking existence
    function findDoctorIndex(address _patientAddress, address _doctorAddress) private view returns (int256) {
        Patient storage patient = patients[_patientAddress];
        for (int256 i = 0; i < int256(patient.doctors.length); i++) {
            if (patient.doctors[uint256(i)] == _doctorAddress) {
                return i;
            }
        }
        return -1;
    }

    function findPatientIndex(address _patientAddress, address _doctorAddress) private view returns (int256) {
        Doctor storage doctor = doctors[_doctorAddress];
        for (int256 i = 0; i < int256(doctor.patientsList.length); i++) {
            if (doctor.patientsList[uint256(i)] == _patientAddress) {
                return i;
            }
        }
        return -1;
    }

    function checkDoctorAlreadyExists(address _patientAddress, address _doctorAddress) public view returns (bool) {
        Patient storage patient = patients[_patientAddress];
        for (int256 i = 0; i < int256(patient.doctors.length); i++) {
            if (patient.doctors[uint256(i)] == _doctorAddress) {
                return true;
            }
        }
        return false;
    }

    function checkPatientAlreadyExists(address _patientAddress, address _doctorAddress) public view returns (bool) {
        Doctor storage doctor = doctors[_doctorAddress];
        for (int256 i = 0; i < int256(doctor.patientsList.length); i++)
        {
            if (doctor.patientsList[uint256(i)] == _patientAddress) {
                return true;
            }
        }
        return false;
    }

    // Getter functions

    // Get details of a patient
    function getPatientDetails(address _index) 
    public 
    view 
    returns (
        string memory, 
        string memory, 
        uint256, 
        string memory, 
        string memory, 
        string memory, 
        string memory, 
        string memory
    ) 
{
    Patient storage patient = patients[_index];
    return (
        patient.name, 
        patient.phone, 
        patient.age, 
        patient.gender, 
        patient.height, 
        patient.weight, 
        patient.bloodType, 
        patient.allergies
    );
}


    // Get diagnosis provided by a doctor for a patient
    function getDoctorDiagnosis(address _doctorAddress) public view returns (string memory, string memory) {
        Diagnosis memory doctorDiagnosis = patients[msg.sender].doctorDiagnoses[_doctorAddress];
        return (doctorDiagnosis.diagnosis, doctorDiagnosis.medicineInformation);
    }
     
     // Get details of a doctor
    function getDoctorDetails(address _index) public view returns (string memory, string memory, string memory, string memory, string memory, string memory) {
    require(bytes(doctors[_index].name).length > 0, "Doctor does not exist");
    Doctor storage doctor = doctors[_index];
    return (doctor.name, doctor.phone, doctor.gender, doctor.qualification, doctor.major, doctor.details);
}


    // Get list of doctors for a patient
    function getDoctorList(address _patient) public view returns (address[] memory) {
        return patients[_patient].doctors;
    }

    // Get list of patients for a doctor
    function getPatientListForDoctor(address _doctor) public view returns (address[] memory) {
        return doctors[_doctor].patientsList;
    }

    
    // Check if sender is registered as a doctor
    function addressDoctorExists() public view returns (bool) {
        return bytes(doctors[msg.sender].name).length != 0;
    }

    // Check if sender is registered as a patient
    function addressPatientExists() public view returns (bool) {
        return bytes(patients[msg.sender].name).length != 0;
    }

    // Get names and addresses of all registered doctors
    function getAllDoctorsNamesAddresses() public view returns (string[][] memory) {
        string[][] memory doctorsDetails = new string[][](totalNumberOfDoctors);

        for (uint256 i = 0; i < totalNumberOfDoctors; i++) {
            string[] memory doctorsEachDetails = new string[](5);
            address ds = doctorsList[i];
            doctorsEachDetails[0] = doctors[ds].name;
            doctorsEachDetails[1] = doctors[ds].phone;
            doctorsEachDetails[2] = doctors[ds].gender;
            doctorsEachDetails[3] = doctors[ds].qualification;
            doctorsEachDetails[4] = doctors[ds].major;
            doctorsDetails[i] = doctorsEachDetails;
        }
        return (doctorsDetails);
    }

    // Convert address to string (helper function)
    function addressToString(address _address) public pure returns (string memory) {
        return Strings.toHexString(uint256(uint160(_address)), 20);
    }

    // Get previous diagnosis provided by a doctor for a patient
    function getPreviousDiagnosis(address _patientAddress) public view returns (string memory, string memory) {
        Diagnosis storage diagnosis = patients[_patientAddress].doctorDiagnoses[msg.sender];
        return (diagnosis.diagnosis, diagnosis.medicineInformation);
    }
}