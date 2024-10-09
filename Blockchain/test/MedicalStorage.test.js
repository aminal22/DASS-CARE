const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("MedicalStorage", () => {
    let medical, user0, user1, user2, user3;

    beforeEach(async () => {
        const Medical = await ethers.getContractFactory("MedicalStorage");
        [user0, user1, user2, user3] = await ethers.getSigners();
        medical = await Medical.deploy();
        await medical.deployed();
    });

    describe("Register doctor", () => {
        beforeEach(async () => {
            await medical.connect(user1).registerDoctor("Shyam", "MBBS second year");
        });

        it("The doctor name and details are the same", async () => {
            const doctorDetails = await medical.getDoctorDetails(user1.address);
            expect(doctorDetails[0]).to.equal("Shyam");
            expect(doctorDetails[1]).to.equal("MBBS second year");
        });

        it("Emits a Register doctor event", async () => {
            await expect(medical.connect(user1).registerDoctor("Shyam", "MBBS second year"))
                .to.be.revertedWith("Doctor already registered.");
        });
    });

    describe("Add patient", () => {
        beforeEach(async () => {
            await medical.connect(user0).addPatient("Ram", "1234567890", 21, "male", "6ft", "70kg", "O+", "none", "dengue");
        });

        it("The patient is added", async () => {
            const patientDetails = await medical.getPatientDetails(user0.address);
            expect(patientDetails[0]).to.equal("Ram");
            expect(patientDetails[1]).to.equal("1234567890");
            expect(patientDetails[2]).to.equal(21);
            expect(patientDetails[3]).to.equal("male");
            expect(patientDetails[4]).to.equal("6ft");
            expect(patientDetails[5]).to.equal("70kg");
            expect(patientDetails[6]).to.equal("O+");
            expect(patientDetails[7]).to.equal("none");
            expect(patientDetails[8]).to.equal("dengue");
        });

        it("Emits an add patient event", async () => {
            await expect(medical.connect(user0).addPatient("Ram", "1234567890", 21, "male", "6ft", "70kg", "O+", "none", "dengue"))
                .to.emit(medical, "MedicalStorage__AddPatient")
                .withArgs("Ram", 21, "dengue");
        });
    });

    describe("Add Doctor for the patient", () => {
        beforeEach(async () => {
            await medical.connect(user1).registerDoctor("Shyam", "MBBS second year");
            await medical.connect(user2).registerDoctor("Arun", "MBBS first year");
            await medical.connect(user0).addPatient("Ram", "1234567890", 21, "male", "6ft", "70kg", "O+", "none", "dengue");
        });

        it("Success: The doctor is added to the patient list and the patient is also added to the doctor's list", async () => {
            await medical.connect(user0).addDoctor(user1.address);
            const patientDoctors = await medical.getDoctorList(user0.address);
            expect(patientDoctors).to.include(user1.address);
            const doctorPatients = await medical.getPatientListForDoctor(user1.address);
            expect(doctorPatients).to.include(user0.address);
        });

        it("Emits an add doctor event", async () => {
            await expect(medical.connect(user0).addDoctor(user1.address))
                .to.emit(medical, "MedicalStorage__AddDoctor")
                .withArgs(user0.address, user1.address);
        });

        it("Failure: If the patient and the doctor address are the same", async () => {
            await expect(medical.connect(user0).addDoctor(user0.address))
                .to.be.revertedWith("The patient address cannot be equal to the doctor's address.");
        });

        it("Failure: If the doctor already exists", async () => {
            await medical.connect(user0).addDoctor(user1.address);
            await expect(medical.connect(user0).addDoctor(user1.address))
                .to.be.revertedWith("Doctor already exists in your list.");
        });
    });

    describe("Revoke Doctor access", () => {
        beforeEach(async () => {
            await medical.connect(user1).registerDoctor("Shyam", "MBBS second year");
            await medical.connect(user2).registerDoctor("Arun", "MBBS first year");
            await medical.connect(user0).addPatient("Ram", "1234567890", 21, "male", "6ft", "70kg", "O+", "none", "dengue");
            await medical.connect(user0).addDoctor(user1.address);
        });

        it("Success: The doctor is removed from the patient list and the patient is also deleted from the doctor's patient list", async () => {
            await medical.connect(user0).revokeDoctorAccess(user1.address);
            const patientDoctors = await medical.getDoctorList(user0.address);
            expect(patientDoctors).to.not.include(user1.address);
            const doctorPatients = await medical.getPatientListForDoctor(user1.address);
            expect(doctorPatients).to.not.include(user0.address);
        });

        it("Emits a revoke doctor access event", async () => {
            await expect(medical.connect(user0).revokeDoctorAccess(user1.address))
                .to.emit(medical, "MedicalStorage__RevokeDoctorAccess")
                .withArgs(user0.address, user1.address);
        });

        it("Failure: Reverts if the doctor is not there", async () => {
            await expect(medical.connect(user0).revokeDoctorAccess(user2.address))
                .to.be.revertedWith("Doctor not found.");
        });
    });

    describe("Provide Diagnosis", () => {
        beforeEach(async () => {
            await medical.connect(user1).registerDoctor("Shyam", "MBBS second year");
            await medical.connect(user2).registerDoctor("Arun", "MBBS first year");
            await medical.connect(user0).addPatient("Ram", "1234567890", 21, "male", "6ft", "70kg", "O+", "none", "dengue");
            await medical.connect(user0).addDoctor(user1.address);
        });

        it("Success: The diagnosis is done", async () => {
            await medical.connect(user1).provideDiagnosis(user0.address, "flu", "paracetamol");
            const diagnosis = await medical.getDoctorDiagnosis(user1.address);
            expect(diagnosis[0]).to.equal("flu");
            expect(diagnosis[1]).to.equal("paracetamol");
        });

        it("Failure: The diagnosis can't be done by an unauthorized doctor", async () => {
            await expect(medical.connect(user2).provideDiagnosis(user0.address, "flu", "paracetamol"))
                .to.be.revertedWith("Doctor not authorized.");
        });
    });
});
