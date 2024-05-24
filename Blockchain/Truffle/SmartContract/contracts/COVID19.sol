// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CovidDetection {
    // Structure pour représenter les données des capteurs
    struct SensorData {
        uint256 oxygenLevel;
        uint256 pulseRate;
        uint256 temperature;
    }

    // Mapping des données des capteurs par adresse du patient
    mapping(address => SensorData) public sensorDataRecords;

    // Adresse des professionnels de la santé à notifier
    address[] public healthProfessionals;

    // Événement déclenché en cas de détection de symptômes
    event SymptomDetected(address indexed patient, string message);

    // Fonction pour ajouter un professionnel de la santé
    function addHealthProfessional(address _healthProfessional) public {
        healthProfessionals.push(_healthProfessional);
    }

    // Fonction pour soumettre des données de capteurs
    function submitSensorData(uint256 _oxygenLevel, uint256 _pulseRate, uint256 _temperature) public {
        sensorDataRecords[msg.sender] = SensorData(_oxygenLevel, _pulseRate, _temperature);
        detectSymptoms(msg.sender);
    }

    // Fonction pour détecter les symptômes de la COVID-19
    function detectSymptoms(address _patient) internal {
        SensorData memory data = sensorDataRecords[_patient];
        if (data.oxygenLevel < 95 || data.pulseRate > 100 || data.temperature > 38) {
            emit SymptomDetected(_patient, "Potential COVID-19 symptoms detected");
        }
    }
}
