import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Doctor, Patient, Register, Shell } from "./Container";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  loadAccount,
  loadMedicalStorage,
  loadNetwork,
  loadProvider,
  subscribeToEvents,
} from "./Store/Interactions";
import config from "./config.json";
import { Alert } from "./Components";

function App() {
  const dispatch = useDispatch();

  const loadBlockchainData = async () => {
    try {
      const provider = loadProvider(dispatch);
      const chainId = await loadNetwork(provider, dispatch);
      console.log("Current Chain ID:", chainId); // Check the logged chain ID
  
      // Check if MedicalStorage address exists for the chainId
      const medicalStorageAddress = config[chainId]?.MedicalStorage?.address;
  
      if (!medicalStorageAddress) {
        console.error("MedicalStorage address not found for chainId:", chainId);
        return;
      }
  
      // Load the MedicalStorage contract
      const medicalStorage = await loadMedicalStorage(provider, medicalStorageAddress, dispatch);
  
      if (!medicalStorage) {
        console.error("MedicalStorage contract not loaded");
        return;
      }
  
      // Subscribe to events
      subscribeToEvents(medicalStorage, dispatch);
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    }
  };
  

  useEffect(() => {
    loadBlockchainData();
  }, []); // Add an empty dependency array to run once on mount

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Shell />} />
        <Route path="/Patient" element={<Patient />} />
        <Route path="/Doctor" element={<Doctor />} />
        <Route path="/Register" element={<Register />} /> {/* Added Register route */}
      </Routes>
      <Alert />
    </div>
  );
}

export default App;
