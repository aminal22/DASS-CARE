import { ethers } from "ethers";
import MEDICALSTORAGE_ABI from "../Abis/MedicalStorage.json";

export const loadProvider = async (dispatch) => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    dispatch({ type: 'PROVIDER_LOADED', payload: provider });
    return provider;
  } else {
    console.error("No Ethereum provider found. Install MetaMask.");
    return null;
  }
};

export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork();
  dispatch({ type: "NETWORK_LOADED", chainId });
  return chainId;
};

export const loadAccount = async (provider, dispatch) => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = ethers.utils.getAddress(accounts[0]);
  dispatch({ type: "ACCOUNT_LOADED", account });
  return account;
};
export const loadMedicalStorage = async (provider, contractAddress, dispatch) => {
  try {
    const signer = provider.getSigner();
    const medicalStorage = new ethers.Contract(contractAddress, MEDICALSTORAGE_ABI, signer); // Load contract
    dispatch({ type: "MEDICALSTORAGE_LOADED", medicalStorage });
    return medicalStorage;
  } catch (error) {
    console.error("Error loading MedicalStorage contract:", error);
    return null;
  }
};

export const registerUser = async (
  name,
  phoneNum,
  Age,
  gender,
  Height,
  Weight,
  BloodType,
  Allergies,
  Problem,
  provider,
  medicalStorage,
  dispatch,
  type // Make sure to add 'type' parameter
) => {
  dispatch({ type: "REGISTER_REQUEST" });
  
  try {
    const signer = provider.getSigner();
    
    let transaction;
    if (type === "patient") {
      transaction = await medicalStorage
        .connect(signer)
        .addPatient(name, phoneNum, Age, gender, Height, Weight, BloodType, Allergies, Problem);
    } else {
      const details = ""; // Define 'details' if needed
      transaction = await medicalStorage
        .connect(signer)
        .registerDoctor(name, details);
    }
    
    await transaction.wait();
    dispatch({ type: "REGISTER_SUCCESS" });
  } catch (error) {
    console.error("Error registering user:", error);
    dispatch({ type: "REGISTER_FAIL" });
  }
};

export const registerDoctor = async (
  name,
  phone,
  gender,
  qualification,
  major,
  details,
  provider,
  medicalStorage,
  dispatch
) => {
  dispatch({ type: "REGISTER_DOCTOR_REQUEST" });
  
  try {
    const signer = provider.getSigner();
    const transaction = await medicalStorage
      .connect(signer)
      .registerDoctor(name, phone, gender, qualification, major, details);
    await transaction.wait();
    dispatch({ type: "REGISTER_DOCTOR_SUCCESS" });
  } catch (error) {
    console.error("Error registering doctor:", error);
    dispatch({ type: "REGISTER_DOCTOR_FAIL" });
  }
};

export const checkPatientAlreadyExists = async (provider, medicalStorage) => {
  try {
    const signer = provider.getSigner();
    const exists = await medicalStorage.addressPatientExists({ from: signer.getAddress() });
    return exists;
  } catch (error) {
    console.error("Error checking if patient exists:", error);
    throw error;
  }
};


export const checkDoctorAlreadyExists = async (provider, medicalStorage) => {
  const signer = await provider.getSigner();
  const exists = await medicalStorage.connect(signer).addressDoctorExists();
  return exists;
};
export const getPatientDetails = async (address, medicalStorage) => {
  try {
    const details = await medicalStorage.getPatientDetails(address);
    console.log(details);
  } catch (error) {
    console.error("Error fetching patient details:", error);
  }
};
export const getDoctorList = async (medicalStorage, address) => {
  const doctorList = await medicalStorage.getDoctorList(address);
  return doctorList;
};

export const getDoctorDetails = async (contract, account) => {
  try {
    // Call the contract function
    const details = await contract.getDoctorDetails(account);

    // The function returns a tuple of strings, unpack them accordingly
    const doctorDetails = {
      name: details[0],
      phone: details[1],
      gender: details[2],
      qualification: details[3],
      major: details[4],
      details: details[5]
    };

    return doctorDetails;
  } catch (error) {
    console.error('Error fetching doctor details:', error);
    throw error;
  }
};

export const getDoctorDiagnosis = async (provider, medicalStorage, doctor) => {
  const signer = await provider.getSigner();
  const diagnosis = await medicalStorage
    .connect(signer)
    .getDoctorDiagnosis(doctor);
  return diagnosis;
};

export const getAllDoctorNameAddresses = async (medicalStorage) => {
  const details = await medicalStorage.getAllDoctorsNamesAddresses();
  return details;
};

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
    console.error("Error adding doctor:", error);
    dispatch({ type: "ADD_DOCTOR_FAIL" });
  }
};

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
    console.error("Error revoking doctor access:", error);
    dispatch({ type: "REVOKE_DOCTOR_FAIL" });
  }
};

export const getPatientListForDoctor = async (contract, doctorAddress) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum); // Ensure Web3Provider is used
    const signer = provider.getSigner(); // Fetch signer from provider

    // Call the contract function with the signer
    const patientList = await contract.getPatientListForDoctor(doctorAddress, { from: await signer.getAddress() });

    return patientList;
  } catch (error) {
    console.error("Error fetching patient list for doctor:", error);
    throw error;
  }
};


export const provideDiagnosis = async (
  patientAddress,
  provider,
  medicalStorage,
  diagnosis,
  medicineInformation,
  dispatch
) => {
  let transaction;
  dispatch({ type: "PROVIDE_DIAGNOSIS_INITIALIZED" });
  try {
    const signer = await provider.getSigner();
    transaction = await medicalStorage
      .connect(signer)
      .provideDiagnosis(patientAddress, diagnosis, medicineInformation);
    await transaction.wait();
    dispatch({ type: "PROVIDE_DIAGNOSIS_SUCCESS" });
  } catch (error) {
    console.error("Error providing diagnosis:", error);
    dispatch({ type: "PROVIDE_DIAGNOSIS_FAIL" });
  }
};

export const getPreviousDiagnosis = async (
  patientAddress,
  provider,
  medicalStorage
) => {
  const signer = await provider.getSigner();
  let patientDiagnosis = await medicalStorage
    .connect(signer)
    .getPreviousDiagnosis(patientAddress);
  return patientDiagnosis;
};

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
