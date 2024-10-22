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
    const provider = loadProvider(dispatch);
    const chainId = await loadNetwork(provider, dispatch);
    window.ethereum.on("accountChanged", () => {
      loadAccount(provider, dispatch);
    });
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    const contractAddress = "0xBbD18ad3803782182F6C7d5712f9369707C80caf";
    const medicalStorage = loadMedicalStorage(
      provider,
      contractAddress,
      dispatch
    );
    subscribeToEvents(medicalStorage, dispatch);
  };
  useEffect(() => {
    loadBlockchainData();
  });
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Shell />}></Route>
        <Route path="/Patient" element={<Patient />}></Route>
        <Route path="/Doctor" element={<Doctor />}></Route>
      </Routes>
      <Alert />
    </div>
  );
}

export default App;