import { ethers } from "ethers";
import MEDICALSTORAGE_ABI from "../Abis/MedicalStorage.json";

// Load the Web3 provider
export const loadProvider = (dispatch) => {
  const connection = new ethers.providers.Web3Provider(window.ethereum);
  dispatch({ type: "PROVIDER_LOADED", connection });
  return connection;
};

// Load the network information
export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork();
  dispatch({ type: "NETWORK_LOADED", chainId });
  return chainId;
};

// Load the user's account
export const loadAccount = async (provider, dispatch) => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = ethers.utils.getAddress(accounts[0]);
  dispatch({ type: "ACCOUNT_LOADED", account });
  return account;
};

// Load the MedicalStorage contract
export const loadMedicalStorage = (provider, address, dispatch) => {
  const medicalStorage = new ethers.Contract(address, MEDICALSTORAGE_ABI, provider);
  dispatch({ type: "MEDICALSTORAGE_LOADED", medicalStorage });
  return medicalStorage;
};

// Register a user (patient or doctor)
export const registerUser = async (
  name,
  phone,
  ageOrQualification, // Depending on the type (age for patient, qualification for doctor)
  gender,
  heightOrMajor, // Height for patient, major for doctor
  weightOrDetails, // Weight for patient, details for doctor
  medicalStorage,
  provider,
  dispatch, // Ensure dispatch is passed here
  registerType
) => {
  try {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      medicalStorage.address,
      MEDICALSTORAGE_ABI,
      signer
    );

    if (registerType === "patient") {
      const transaction = await contract.addPatient(
        name,
        phone,
        ageOrQualification,
        gender,
        heightOrMajor,
        weightOrDetails
      );
      await transaction.wait(); // Wait for transaction confirmation
      dispatch({
        type: "PATIENT_REGISTERED",
        payload: { name, phone, age: ageOrQualification, gender },
      });
    } else if (registerType === "doctor") {
      const transaction = await contract.registerDoctor(
        name,
        phone,
        gender,
        ageOrQualification, // Qualification
        heightOrMajor, // Major or specialty
        weightOrDetails // Additional details
      );
      await transaction.wait();
      dispatch({
        type: "DOCTOR_REGISTERED",
        payload: { name, phone, qualification: ageOrQualification, gender },
      });
    }
  } catch (error) {
    console.error("Registration failed", error);
    dispatch({
      type: "REGISTRATION_FAILED",
      error,
    });
  }
};

// Check if a patient already exists
export const checkPatientAlreadyExists = async (provider, medicalStorage) => {
  const signer = await provider.getSigner();
  const exists = await medicalStorage.connect(signer).addressPatientExists();
  return exists;
};

// Check if a doctor already exists
export const checkDoctorAlreadyExists = async (provider, medicalStorage) => {
  const signer = await provider.getSigner();
  const exists = await medicalStorage.connect(signer).addressDoctorExists();
  return exists;
};

// Get patient details
export const getPatientDetails = async (medicalStorage, address) => {
  const details = await medicalStorage.getPatientDetails(address);
  return details;
};

// Get the list of doctors
export const getDoctorList = async (medicalStorage, address) => {
  const doctorList = await medicalStorage.getDoctorList(address);
  return doctorList;
};

// Get details of a specific doctor
export const getDoctorDetails = async (medicalStorage, doctor) => {
  const doctorDetails = await medicalStorage.getDoctorDetails(doctor);
  return doctorDetails;
};

// Get a doctor's diagnosis
export const getDoctorDiagnosis = async (provider, medicalStorage, doctor) => {
  const signer = await provider.getSigner();
  const diagnosis = await medicalStorage
    .connect(signer)
    .getDoctorDiagnosis(doctor);
  return diagnosis;
};

// Get all doctor names and addresses
export const getAllDoctorNameAddresses = async (medicalStorage) => {
  const details = await medicalStorage.getAllDoctorsNamesAddresses();
  return details;
};

// Add a doctor to the medical storage
export const addDoctor = async (
  provider,
  doctorAddress,
  medicalStorage,
  dispatch
) => {
  let transaction;
  dispatch({ type: "ADD_DOCTOR_INITIALIZED" });
  try {
    const signer = await provider.getSigner();
    transaction = await medicalStorage
      .connect(signer)
      .addDoctor(doctorAddress, { gasLimit: 300000 });
    await transaction.wait();
    dispatch({ type: "ADD_DOCTOR_SUCCESS" });
  } catch (error) {
    dispatch({ type: "ADD_DOCTOR_FAIL" });
  }
};

// Revoke a doctor's access
export const revokeDoctorAccess = async (
  provider,
  doctorAddress,
  medicalStorage,
  dispatch
) => {
  let transaction;
  dispatch({ type: "REVOKE_DOCTOR_INITIALIZED" });
  try {
    const signer = await provider.getSigner();
    transaction = await medicalStorage
      .connect(signer)
      .revokeDoctorAccess(doctorAddress);
    await transaction.wait();
    dispatch({ type: "REVOKE_DOCTOR_SUCCESS" });
  } catch (error) {
    dispatch({ type: "REVOKE_DOCTOR_FAIL" });
  }
};

// Get the patient list for a specific doctor
export const getPatientListForDoctor = async (address, medicalStorage) => {
  const patientList = await medicalStorage.getPatientListForDoctor(address);
  return patientList;
};

// Provide a diagnosis for a patient
export const provideDiagnosis = async (
  patientAddress,
  provider,
  medicalStorage,
  diagnosis,
  medicineInformation,
  dispatch
) => {
  dispatch({ type: "PROVIDE_DIAGNOSIS_INITIALIZED" });
  try {
    const contract = new ethers.Contract(medicalStorage.address, MEDICALSTORAGE_ABI, provider.getSigner());
    const transaction = await contract.provideDiagnosis(patientAddress, diagnosis, medicineInformation);
    await transaction.wait();
    dispatch({ type: "PROVIDE_DIAGNOSIS_SUCCESS" });
  } catch (error) {
    console.error("Error providing diagnosis", error);
    dispatch({ type: "PROVIDE_DIAGNOSIS_FAIL", error });
  }
};

// Get previous diagnoses for a patient
export const getPreviousDiagnosis = async (
  patientAddress,
  provider,
  medicalStorage
) => {
  const signer = await provider.getSigner();
  const patientDiagnosis = await medicalStorage
    .connect(signer)
    .getPreviousDiagnosis(patientAddress);
  return patientDiagnosis;
};

// Subscribe to events from the MedicalStorage contract
export const subscribeToEvents = async (medicalStorage, dispatch) => {
  medicalStorage.on("MedicalStorage__AddDoctor", (patient, doctor, event) => {
    dispatch({ type: "ADD_DOCTOR_SUCCESS", event });
  });
  medicalStorage.on(
    "MedicalStorage__RevokeDoctorAccess",
    (patient, doctor, event) => {
      dispatch({ type: "REVOKE_DOCTOR_SUCCESS", event });
    }
  );
  medicalStorage.on(
    "MedicalStorage__ProvideDiagnosis",
    (patient, doctor, diagnosis, medicineInformation, event) => {
      dispatch({ type: "PROVIDE_DIAGNOSIS_SUCCESS", event });
    }
  );
};
