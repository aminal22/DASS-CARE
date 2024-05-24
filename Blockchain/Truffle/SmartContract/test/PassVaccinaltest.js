const VaccinePassport = artifacts.require("VaccinePassport");

contract("VaccinePassport", (accounts) => {
    it("should record a vaccination correctly", async () => {
        const vaccinePassportInstance = await VaccinePassport.new();

        // Define test data
        const isVaccinated = true;
        const vaccineName = "COVID-19";
        const doseNumber = 1;
        const vaccinationDate = Math.floor(Date.now() / 1000); // Current timestamp

        // Record vaccination
        await vaccinePassportInstance.recordVaccination(isVaccinated, vaccineName, doseNumber, vaccinationDate, { from: accounts[0] });

        // Fetch the recorded vaccination data
        const record = await vaccinePassportInstance.vaccinationRecords(accounts[0]);

        // Verify the recorded data
        assert.equal(record.isVaccinated, isVaccinated, "Vaccination status is incorrect");
        assert.equal(record.vaccineName, vaccineName, "Vaccine name is incorrect");
        assert.equal(record.doseNumber, doseNumber, "Dose number is incorrect");
        assert.equal(record.vaccinationDate.toNumber(), vaccinationDate, "Vaccination date is incorrect");
    });
});
