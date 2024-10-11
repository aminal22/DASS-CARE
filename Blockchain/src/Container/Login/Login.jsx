import React, { useState } from "react";
import "./login.css";
import {
  checkDoctorAlreadyExists,
  checkPatientAlreadyExists,
  loadAccount,
} from "../../Store/Interactions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const medicalStorage = useSelector((state) => state.MedicalStorage.contract);
  const provider = useSelector((state) => state.Provider.connection);
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState(""); // Set initial value to empty string for validation
  const [loading, setLoading] = useState(false); // Manage loading state

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!loginType) {
      alert("Please select a type of registration.");
      return;
    }

    setLoading(true); // Set loading state to true while the async call is happening

    try {
      await loadAccount(provider, dispatch);

      if (loginType === "patient") {
        const patientLogin = await checkPatientAlreadyExists(provider, medicalStorage);
        if (patientLogin) {
          navigate("/Patient", { state: {} });
        } else {
          alert("You are not registered as a patient. Please register first.");
        }
      } else if (loginType === "doctor") {
        const doctorLogin = await checkDoctorAlreadyExists(provider, medicalStorage);
        if (doctorLogin) {
          navigate("/Doctor", { state: {} });
        } else {
          alert("You are not registered as a doctor. Please register first.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after async call completes
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Login as :</label>
          <select
            name="loginAs"
            onChange={(e) => setLoginType(e.target.value)}
            value={loginType}
            required
          >
            <option value="" disabled>
              Select type of registration
            </option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>

        <div className="form-group">
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
