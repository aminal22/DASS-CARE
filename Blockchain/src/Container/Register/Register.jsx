import React, { useState } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { loadAccount, registerUser } from "../../Store/Interactions";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const provider = useSelector((state) => state.Provider.connection);
  const medicalStorage = useSelector((state) => state.MedicalStorage.contract);
  const dispatch = useDispatch();
  const [registerType, setRegisterType] = useState("patient");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [problem, setProblem] = useState("");
  const [details, setDetails] = useState("");

  const registerHandler = (e) => {
    setRegisterType(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    loadAccount(provider, dispatch);
    if (registerType === "patient") {
      await registerUser(
        name,
        age,
        problem,
        registerType,
        provider,
        medicalStorage,
        dispatch
      );
      navigate("/Patient");
    } else {
      await registerUser(
        name,
        details,
        problem,
        registerType,
        provider,
        medicalStorage,
        dispatch
      );
      navigate("/Doctor");
    }
    // Reset form fields
    setName("");
    setAge("");
    setDetails("");
    setProblem("");
  };

  return (
    <div className="container">
      <h2>DASS CARE</h2>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Register as:</label>
          <select
            name="registerAs"
            onChange={registerHandler}
            value={registerType}
          >
            <option value="0" disabled>
              Select type of registration
            </option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            placeholder="Nouhaila Amina"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        {registerType === "patient" ? (
          <>
            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                placeholder="21"
                onChange={(e) => setAge(e.target.value)}
                value={age}
                required
              />
            </div>
            <div className="form-group">
              <label>Problem:</label>
              <input
                type="text"
                placeholder="Diabetes"
                onChange={(e) => setProblem(e.target.value)}
                value={problem}
                required
              />
            </div>
          </>
        ) : (
          <div className="form-group">
            <label>Details:</label>
            <input
              type="text"
              placeholder="Holding an MBBS degree"
              onChange={(e) => setDetails(e.target.value)}
              value={details}
              required
            />
          </div>
        )}

        <div className="form-group">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
