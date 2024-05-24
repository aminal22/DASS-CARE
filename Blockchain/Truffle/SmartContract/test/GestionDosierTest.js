const MedicalRecords = artifacts.require("MedicalRecords");

contract("MedicalRecords", (accounts) => {
  let medicalRecords;

  beforeEach(async () => {
    medicalRecords = await MedicalRecords.new();
  });

  it("should create a medical record", async () => {
    await medicalRecords.createMedicalRecord("Medical data", true, { from: accounts[0] });
    const medicalRecord = await medicalRecords.getMedicalRecord(accounts[0]);
    assert.equal(medicalRecord, "Medical data");
  });

  it("should grant and revoke access to a medical record", async () => {
    const userAddress = accounts[1];
    await medicalRecords.createMedicalRecord("Medical data", true, { from: accounts[0] });

    await medicalRecords.grantAccess(userAddress, { from: accounts[0] });
    let medicalRecord = await medicalRecords.getMedicalRecord(accounts[0], { from: userAddress });
    assert.equal(medicalRecord, "Medical data");

    await medicalRecords.revokeAccess(userAddress, { from: accounts[0] });
  });
});
