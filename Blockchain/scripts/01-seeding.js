const { ethers } = require("hardhat");
const config = require("../src/config.json");

async function main() {
  // Get the list of available signers
  const accounts = await ethers.getSigners();

  // Fetch the chain ID of the network
  const { chainId } = await ethers.provider.getNetwork();
  console.log(`ChainId is ${chainId}`);

  // Get the deployed contract instance
  const medical = await ethers.getContractAt(
    "MedicalStorage",
    config[chainId].MedicalStorage.address
  );
  console.log(`Contract fetched with address ${medical.address}`);

  // Add a patient
  console.log(`Adding a patient`);
  let transaction;
  transaction = await medical.connect(accounts[0]).addPatient(
    "Ilyass", // Name
    "1234567890", // Phone
    32, // Age
    "Male", // Gender
    "5'9\"", // Height
    "70kg", // Weight
    "O+", // Blood type
    "None", // Allergies
    "I am ill", // Problem
    { gasLimit: 3000000 }
  );
  await transaction.wait();
  console.log("Patient added");

  // Register a doctor
  console.log(`Registering a doctor`);
  transaction = await medical.connect(accounts[1]).registerDoctor(
    "Youness", // Name
    "1234567891", // Phone
    "Male", // Gender
    "MBBS", // Qualification
    "Cardiology", // Major
    "Some details", // Details
    { gasLimit: 3000000 }
  );
  await transaction.wait();
  console.log("Doctor registered");

  // Add the doctor to the patient's list
  console.log("Adding doctor to patient's list");
  transaction = await medical.connect(accounts[0]).addDoctor(
    accounts[1].address,
    { gasLimit: 3000000 }
  );
  await transaction.wait();
  console.log("Doctor added to patient's list");

  // Provide a diagnosis
  console.log("Doctor providing the diagnosis");
  transaction = await medical.connect(accounts[1]).provideDiagnosis(
    accounts[0].address,
    "Take rest",
    "Take medicine",
    { gasLimit: 3000000 }
  );
  await transaction.wait();
  console.log("Diagnosis provided");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
