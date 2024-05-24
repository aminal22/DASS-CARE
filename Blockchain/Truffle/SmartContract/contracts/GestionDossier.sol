// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MedicalRecords {
    // Structure pour représenter un dossier médical
    struct MedicalRecord {
        address patient; // Adresse du patient
        string data;     // Données médicales
        bool isPublic;   // Indicateur si le dossier est public ou privé
        mapping(address => bool) authorizedUsers; // Liste des utilisateurs autorisés à accéder au dossier
    }

    // Mapping des dossiers médicaux par adresse du patient
    mapping(address => MedicalRecord) medicalRecords;

    // Fonction pour créer un nouveau dossier médical
    function createMedicalRecord(string memory _data, bool _isPublic) public {
        medicalRecords[msg.sender].patient = msg.sender;
        medicalRecords[msg.sender].data = _data;
        medicalRecords[msg.sender].isPublic = _isPublic;
    }

    // Fonction pour autoriser un utilisateur à accéder au dossier médical
    function grantAccess(address _user) public {
        medicalRecords[msg.sender].authorizedUsers[_user] = true;
    }

    // Fonction pour révoquer l'accès d'un utilisateur au dossier médical
    function revokeAccess(address _user) public {
        medicalRecords[msg.sender].authorizedUsers[_user] = false;
    }

    // Fonction pour accéder aux données médicales d'un patient
    function getMedicalRecord(address _patient) public view returns (string memory) {
        // Vérifier si l'appelant est autorisé à accéder au dossier médical
        require(msg.sender == _patient || medicalRecords[_patient].authorizedUsers[msg.sender] || medicalRecords[_patient].isPublic, "Access denied");
        return medicalRecords[_patient].data;
    }
}
