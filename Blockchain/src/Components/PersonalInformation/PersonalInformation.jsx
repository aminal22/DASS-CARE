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
  const [doctorList, setDoctorList] = useState(null);
  const [showDiagnosis, setShowDiagnosis] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      const details = await getPatientDetails(medicalStorage, account);
      const doctorList = await getDoctorList(medicalStorage, account);
      setDoctorList(doctorList);
      setDetails(details);
    };
    
    if (medicalStorage && account) {
      fetchDetails();
    }
  }, [medicalStorage, account, transferInProgress]);

  return (
    <div className="personalInformation">
      <h2>Personal Information</h2>
      <p>
        <strong>Name:</strong> {details && details.name}
      </p>
      <p>
        <strong>Phone:</strong> {details && details.phone}
      </p>
      <p>
        <strong>Age:</strong> {details && details.age}
      </p>
      
      <p>
        <strong>Gender:</strong> {details && details.gender}
      </p>
      <p>
        <strong>Height:</strong> {details && details.height}
      </p>
      <p>
        <strong>Weight:</strong> {details && details.weight}
      </p>
      <p>
        <strong>BloodType:</strong> {details && details.bloodType}
      </p>
      <p>
        <strong>Allergies:</strong> {details && details.allergies}
      </p>
      <p>
        <strong>Problem:</strong> {details && details.problem}
      </p>
      <button
        className="btn"
        style={showDiagnosis ? { backgroundColor: "red" } : null}
        onClick={() => setShowDiagnosis(!showDiagnosis)}
      >
        {showDiagnosis ? "Hide Diagnosis" : "Show Diagnosis"}
      </button>
      {showDiagnosis && (
        <div>
          {doctorList &&
            doctorList.map((doctor, index) => (
              <ShowDiagnosis doctor={doctor} key={index} />
            ))}
        </div>
      )}
    </div>
  );
};

export default PersonalInformation;
