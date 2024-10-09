import React, { useEffect, useState } from "react";
import "./personalInformationDoctor.css";
import { useSelector } from "react-redux";
import { getDoctorDetails } from "../../Store/Interactions";

const PersonalInformationDoctor = () => {
  const account = useSelector((state) => state.Provider.account);
  const medicalStorage = useSelector((state) => state.MedicalStorage.contract);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (medicalStorage && account) {
          const details = await getDoctorDetails(medicalStorage, account);
          setDetail(details);
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
        setError(error.message); // Set error state
      }
    };
    fetchDetails();
  }, [medicalStorage, account]);

  return (
    <div className="personalInformationDoctor">
      <h2>Personal Information</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {detail && (
        <>
          <p><strong>Name:</strong> {detail.name}</p>
          <p><strong>Phone:</strong> {detail.phone}</p>
          <p><strong>Gender:</strong> {detail.gender}</p>
          <p><strong>Qualification:</strong> {detail.qualification}</p>
          <p><strong>Major:</strong> {detail.major}</p>
          <p><strong>Details:</strong> {detail.details}</p>
        </>
      )}
    </div>
  );
};

export default PersonalInformationDoctor;
