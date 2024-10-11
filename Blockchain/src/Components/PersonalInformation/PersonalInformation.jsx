import React, { useEffect, useState } from "react";
import "./personalInformation.css";
import { getDoctorList, getPatientDetails } from "../../Store/Interactions";
import { useSelector } from "react-redux";
import ShowDiagnosis from "../ShowDiagnosis/ShowDiagnosis";

const PersonalInformation = () => {
  const account = useSelector((state) => state.Provider.account);
  const medicalStorage = useSelector((state) => state.MedicalStorage.contract);
  const transferInProgress = useSelector(
    (state) => state.MedicalStorage.transferInProgress
  );

  const [details, setDetails] = useState(null);
  const [doctorList, setDoctorList] = useState([]);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Account:", account); // Log account
    console.log("Medical Storage Contract:", medicalStorage); // Log contract

    const fetchDetails = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        if (!medicalStorage || !account) {
          setError("Medical storage contract or account is not defined.");
          return;
        }
        
        console.log("Fetching patient details..."); // Debugging line
        const fetchedDetails = await getPatientDetails(medicalStorage, account);
        console.log("Fetched Patient Details:", fetchedDetails); // Debugging line
        
        if (!fetchedDetails) {
          setError("Failed to fetch patient details.");
          return;
        }
        
        console.log("Fetching doctor list..."); // Debugging line
        const fetchedDoctorList = await getDoctorList(medicalStorage, account);
        console.log("Fetched Doctor List:", fetchedDoctorList); // Debugging line
        
        setDoctorList(fetchedDoctorList);
        setDetails(fetchedDetails);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Failed to fetch details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [medicalStorage, account, transferInProgress]);

  const {
    name,
    phone,
    age,
    gender,
    height,
    weight,
    bloodType,
    allergies,
    problem,
  } = details || {};

  return (
    <div className="personalInformation">
      <h2>Personal Information</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : details ? (
        <>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Phone:</strong> {phone}</p>
          <p><strong>Age:</strong> {age}</p>
          <p><strong>Gender:</strong> {gender}</p>
          <p><strong>Height:</strong> {height}</p>
          <p><strong>Weight:</strong> {weight}</p>
          <p><strong>Blood Type:</strong> {bloodType}</p>
          <p><strong>Allergies:</strong> {allergies}</p>
          <p><strong>Problem:</strong> {problem}</p>
          <button
            className="btn"
            style={showDiagnosis ? { backgroundColor: "red" } : null}
            onClick={() => setShowDiagnosis(!showDiagnosis)}
          >
            {showDiagnosis ? "Hide Diagnosis" : "Show Diagnosis"}
          </button>
          {showDiagnosis && (
            <div>
              {doctorList.length > 0 ? (
                doctorList.map((doctor, index) => (
                  <ShowDiagnosis doctor={doctor} key={index} />
                ))
              ) : (
                <p>No doctors available.</p>
              )}
            </div>
          )}
        </>
      ) : (
        <p>No personal information available.</p>
      )}
    </div>
  );
};

export default PersonalInformation;
