import React, { useState } from "react";
import "./register.css";
import { useNavigate } from "react-router-dom";
import { loadAccount, registerUser } from "../../Store/Interactions";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const provider = useSelector((state) => state.Provider.connection);
  const medicalStorage = useSelector((state) => state.MedicalStorage.contract);
  const dispatch = useDispatch(); 
  const [registerType, setRegisterType] = useState("patient");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");

  const [age, setAge] = useState(0);
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

  /*const submitHandler = async (e) => {
    e.preventDefault();
    loadAccount(provider, dispatch); 

    if (registerType === "patient") {
      await registerUser(
        name,
        phone,
        age,
        gender,
        height,
        weight,
        bloodType,
        allergies,
        problem,
        dispatch 
      );
      navigate("/Patient", {
        state: {},
      });
    } else {
      await registerUser(
        name,
        phone,
        gender,
        qualification,
        major,
        details,
        dispatch 
      );
      navigate("/Doctor", {
        state: {},
      });
    }
*/
const submitHandler = async (e) => {
  e.preventDefault();
  await loadAccount(provider, dispatch); // Assure-toi que l'utilisateur est connecté à son compte

  if (registerType === "patient") {
    await registerUser(
      name,
      phone,
      age, // age pour un patient
      gender,
      height, // taille pour un patient
      weight, // poids pour un patient
      medicalStorage,
      provider,
      dispatch, // dispatch est passé ici
      "patient" // Type d'enregistrement
    );
    navigate("/Patient");
  } else {
    await registerUser(
      name,
      phone,
      qualification, // qualification pour un docteur
      gender,
      major, // spécialité
      details, // détails pour un docteur
      medicalStorage,
      provider,
      dispatch, // dispatch est passé ici
      "doctor" // Type d'enregistrement
    );
    navigate("/Doctor");
  }

    // Reset all fields
    setName("");
    setPhone("");
    setGender("");
    setAge(0);
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
      <h2>Register</h2>
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

        {/* Common fields */}
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            value={name || ""}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="text"
            placeholder="123-456-7890"
            onChange={(e) => setPhone(e.target.value)}
            value={phone || ""}
            required
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <input
            type="text"
            placeholder="Male/Female"
            onChange={(e) => setGender(e.target.value)}
            value={gender || ""}
            required
          />
        </div>

        
        {registerType === "patient" && (
          <>
            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                placeholder="34"
                onChange={(e) => setAge(e.target.value)}
                value={age || ""}
                required
              />
            </div>
            <div className="form-group">
              <label>Height:</label>
              <input
                type="number"
                placeholder="165"
                onChange={(e) => setHeight(e.target.value)}
                value={height || ""}
                required
              />
            </div>
            <div className="form-group">
              <label>Weight:</label>
              <input
                type="number"
                placeholder="50"
                onChange={(e) => setWeight(e.target.value)}
                value={weight || ""}
                required
              />
            </div>
            <div className="form-group">
              <label>Blood Type:</label>
              <input
                type="text"
                placeholder="A"
                onChange={(e) => setBloodType(e.target.value)}
                value={bloodType || ""}
                required
              />
            </div>
            <div className="form-group">
              <label>Allergies:</label>
              <input
                type="text"
                placeholder="Diabetes"
                onChange={(e) => setAllergies(e.target.value)}
                value={allergies || ""}
                required
              />
            </div>
            <div className="form-group">
              <label>Problem:</label>
              <input
                type="text"
                placeholder="Diabetes"
                onChange={(e) => setProblem(e.target.value)}
                value={problem || ""}
                required
              />
            </div>
          </>
        )}

        {registerType === "doctor" && (
          <>
            <div className="form-group">
              <label>Qualification:</label>
              <input
                type="text"
                placeholder="MD"
                onChange={(e) => setQualification(e.target.value)}
                value={qualification || ""}
                required
              />
            </div>
            <div className="form-group">
              <label>Specialization (Major):</label>
              <input
                type="text"
                placeholder="Cardiology"
                onChange={(e) => setMajor(e.target.value)}
                value={major || ""}
                required
              />
            </div>
            <div className="form-group">
              <label>Details:</label>
              <input
                type="text"
                placeholder="Experience, years in practice, etc."
                onChange={(e) => setDetails(e.target.value)}
                value={details || ""}
                required
              />
            </div>
          </>
        )}

        <div className="form-group">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
