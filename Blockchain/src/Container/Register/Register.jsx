import React, { useState } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { loadAccount, registerDoctor, registerUser } from "../../Store/Interactions";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const provider = useSelector((state) => state.Provider.connection);
  const medicalStorage = useSelector((state) => state.MedicalStorage.contract);
  const dispatch = useDispatch();
  const [registerType, setRegisterType] = useState("patient");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [problem, setProblem] = useState("");
  const [qualification, setQualification] = useState("");
  const [major, setMajor] = useState("");
  const [details, setDetails] = useState("");

  const registerHandler = (e) => {
    setRegisterType(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await loadAccount(provider, dispatch);
    if (registerType === "patient") {
      await registerUser(
        name,
        phoneNum,
        age,
        gender,
        height,
        weight,
        bloodType,
        allergies,
        problem,
        provider,
        medicalStorage,
        dispatch
      );
      navigate("/Patient");
    } else {
      await registerDoctor(
        name,
        phoneNum,
        gender,
        qualification,
        major,
        details,
        provider,
        medicalStorage,
        dispatch
      );
      navigate("/Doctor");
    }
    setName("");
    setPhoneNum("");
    setAge("");
    setGender("");
    setHeight("");
    setWeight("");
    setBloodType("");
    setAllergies("");
    setProblem("");
    setQualification("");
    setMajor("");
    setDetails("");
  };

  return (
    <div className="container">
      <h2>Sign up</h2>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Sign up as :</label>
          <select name="registerAs" onChange={registerHandler} value={registerType}>
          <option value="0" disabled>
              Select type of registration
            </option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            placeholder="Your Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="number"
            placeholder="Your Phone Number"
            onChange={(e) => setPhoneNum(e.target.value)}
            value={phoneNum}
            required
          />
        </div>
        {registerType === "patient" ? (
          <div>
            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                placeholder="Your Age"
                onChange={(e) => setAge(e.target.value)}
                value={age}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender:</label>
              <select name="gender" onChange={(e) => setGender(e.target.value)} value={gender}>
              <option value="0" disabled>
                 Select your gender
            </option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div className="form-group">
              <label>Height:</label>
              <input
                type="text"
                placeholder="Your Height"
                onChange={(e) => setHeight(e.target.value)}
                value={height}
                required
              />
            </div>
            <div className="form-group">
              <label>Weight:</label>
              <input
                type="text"
                placeholder="Your Weight"
                onChange={(e) => setWeight(e.target.value)}
                value={weight}
                required
              />
            </div>
            <div className="form-group">
              <label>Blood Type:</label>
              <input
                type="text"
                placeholder="Your Blood Type"
                onChange={(e) => setBloodType(e.target.value)}
                value={bloodType}
                required
              />
            </div>
            <div className="form-group">
              <label>Allergies:</label>
              <input
                type="text"
                placeholder="Your Allergies"
                onChange={(e) => setAllergies(e.target.value)}
                value={allergies}
                required
              />
            </div>
            <div className="form-group">
              <label>Problem:</label>
              <input
                type="text"
                placeholder="Your Problem"
                onChange={(e) => setProblem(e.target.value)}
                value={problem}
                required
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label>Qualification:</label>
              <input
                type="text"
                placeholder="Your Qualification"
                onChange={(e) => setQualification(e.target.value)}
                value={qualification}
                required
              />
            </div>
            <div className="form-group">
              <label>Major:</label>
              <input
                type="text"
                placeholder="Your Major"
                onChange={(e) => setMajor(e.target.value)}
                value={major}
                required
              />
            </div>
            <div className="form-group">
              <label>Details:</label>
              <input
                type="text"
                placeholder="Details about yourself"
                onChange={(e) => setDetails(e.target.value)}
                value={details}
                required
              />
            </div>
          </div>
        )}
        <div className="form-group">
          <button type="submit">Sign up</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
