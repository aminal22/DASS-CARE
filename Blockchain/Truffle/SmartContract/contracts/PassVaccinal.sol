// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VaccinePassport {
    // Structure pour représenter le passe vaccinal d'un patient
    struct VaccinationRecord {
        bool isVaccinated; // Indicateur si le patient est vacciné
        string vaccineName; // Nom du vaccin
        uint256 doseNumber; // Numéro de la dose administrée
        uint256 vaccinationDate; // Date de vaccination
    }

    // Mapping des passe vaccinaux par adresse du patient
    mapping(address => VaccinationRecord) public vaccinationRecords;

    // Fonction pour enregistrer une nouvelle vaccination
    function recordVaccination(bool _isVaccinated, string memory _vaccineName, uint256 _doseNumber, uint256 _vaccinationDate) public {
        vaccinationRecords[msg.sender] = VaccinationRecord(_isVaccinated, _vaccineName, _doseNumber, _vaccinationDate);
    }
}