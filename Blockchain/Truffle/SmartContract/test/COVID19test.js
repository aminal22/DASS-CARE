const CovidDetection = artifacts.require("CovidDetection");

contract("CovidDetection", (accounts) => {
  let covidDetectionInstance;

  beforeEach(async () => {
    covidDetectionInstance = await CovidDetection.new();
  });

  it("should add a health professional", async () => {
    const healthProfessional = accounts[1];
    await covidDetectionInstance.addHealthProfessional(healthProfessional);
    const addedProfessional = await covidDetectionInstance.healthProfessionals(0);
    assert.equal(addedProfessional, healthProfessional, "Health professional not added");
  });

  it("should submit sensor data and detect symptoms", async () => {
    const patient = accounts[0];
    const oxygenLevel = 94;
    const pulseRate = 105;
    const temperature = 39;
    
    await covidDetectionInstance.submitSensorData(oxygenLevel, pulseRate, temperature, { from: patient });
    
    // Get the symptom detection event
    const symptomDetectedEvents = await covidDetectionInstance.getPastEvents("SymptomDetected", {
      filter: { patient: patient },
      fromBlock: 0,
      toBlock: "latest",
    });

    assert.equal(symptomDetectedEvents.length, 1, "Symptom detection event not emitted");
    assert.equal(symptomDetectedEvents[0].returnValues.patient, patient, "Incorrect patient in symptom detection event");
    assert.equal(symptomDetectedEvents[0].returnValues.message, "Potential COVID-19 symptoms detected", "Incorrect symptom message");
  });
});
