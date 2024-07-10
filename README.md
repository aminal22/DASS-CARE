# DASS-Care 2.0

DASS-Care 2.0 is an innovative project aimed at modernizing healthcare services by integrating the latest technological advancements. This platform facilitates decentralized, secure, and scalable access to healthcare services using the Internet of Medical Things (IoMT), Artificial Intelligence (AI), and Blockchain technology. With DASS-Care, patients can benefit from telemedicine services, remote diagnostics, and efficient management of their medical records.

## Features

- **Real-time Health Monitoring:** Continuous monitoring of patients' health using IoMT devices.
- **Secure Collaborative Access:** Secure sharing and access to medical records among healthcare providers.
- **Medical History Storage:** Secure storage of medical history, diagnostics, and prescriptions.
- **Patient Discharge and Billing:** Efficient patient discharge process and handling of bill payments.

## Functional Layers

### User Interaction Layer (UIL)
This layer manages all information about users and devices connected to the framework. It enables healthcare professionals (doctors, nurses, lab technicians, pharmacists, etc.), patients, medical sensors, ambulances, hospitals, insurance companies, and other stakeholders to communicate and share data securely.

### Edge Server Layer (ESL)
This layer consists of servers containing AI algorithms to provide real-time analysis of data from IoMT sensors. The AI algorithms are trained to detect abnormal behaviors in patients and interact directly with healthcare providers for quick intervention.

### Smart Contract Layer
Smart contracts are autonomous programs that facilitate various transactions initiated by different users in the DASS-Care ecosystem. They manage patient information (addition, modifications), medical records, COVID-19 vaccine verification, micropayments, and coronavirus detection using analyzed results from edge servers.

### Ledger Storage Layer (LSL)
The ledgers in this layer store information related to different transactions provided by the smart contract layer in the DASS-Care 2.0 ecosystem. They ensure transparency and traceability of all medical interventions related to patients.

## Ecosystem Workflow


<p align="center">
  <img src="https://github.com/aminal22/DASS-CARE/assets/114859285/e46399cc-7cf6-49c0-b693-f3f6a54865a3" alt="Capture d'écran 2024-07-10 131440" width="400">
  </p>



1. **Registration:** Medical sensors and healthcare stakeholders are registered in the ecosystem via a distributed front-end DApp. The registered information is stored in the distributed ledger via a registration smart contract.
2. **Data Analysis:** Medical sensors provide real-time data such as body temperature, oxygen levels, glucose levels, etc. These data are analyzed by AI edge servers using machine learning (RandomForest) and deep learning (CNN) algorithms.
3. **Anomaly Detection:** In case of anomaly detection, the server triggers smart contracts on the blockchain, such as COVID-19 detection, and alerts the corresponding doctor. The server also periodically sends event triggers to save patient monitoring data in the blockchain.
4. **Real-time Medical Records Access:** Doctors can access the patient's medical records in real-time via the patient monitoring smart contract, which displays the patient's diagnostic history.
5. **Emergency Response:** If further medical follow-up is needed, the system can trigger the dispatch of a smart ambulance equipped with similar monitoring devices. Vital signs are continuously monitored and transmitted in real-time to healthcare professionals at the hospital.
6. **Micropayments:** DASS-Care 2.0 facilitates micropayments for purchasing medications or other services via cryptocurrency.
7. **COVID-19 Passport Verification:** The system verifies the COVID-19 vaccination status using a smart contract, which checks the vaccine name, vaccination date, and the number of doses.
8. **Data Storage:** All transactions within the DASS-Care 2.0 ecosystem are stored on a distributed ledger. Personal data and medical histories are stored in a private blockchain shared among different hospitals, while vaccination records are stored in a public blockchain for accessibility by various stakeholders.

## Technologies Used

- **IoMT (Internet of Medical Things)**
- **Artificial Intelligence (AI)**
  - Machine Learning: RandomForest
  - Deep Learning: Convolutional Neural Networks (CNN)
- **Blockchain**
  - Smart Contracts
  - Distributed Ledger

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- [Ethereum](https://ethereum.org/) client for smart contract deployment

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/aminal22/DASS-CARE.git
   cd DASS-CARE
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Deploy smart contracts:
   ```sh
   truffle migrate --network <network_name>
   ```

4. Run the application:
   ```sh
   npm start
   ```
##Result

<p align="center">
  <img src="https://github.com/aminal22/DASS-CARE/assets/114859285/272e667d-60c7-4613-8513-32bd6e701904" alt="Capture d'écran 2024-07-10 120253" width="800">
  <br>
  <img src="https://github.com/aminal22/DASS-CARE/assets/114859285/5bddad6c-ce53-44ec-8de9-d7d347195985" alt="Capture d'écran 2024-07-10 120239" width="300">
</p>


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- [Amina Ait Lafkih](https://www.linkedin.com/in/amina-ait-lafkih/)
- [Nouhaila Akhziz](https://www.linkedin.com/in/nouhaila-akhziz-14748926b/)
- [Hanane Ouchene](https://www.linkedin.com/in/hanane-ouchene-b1316526b/)
