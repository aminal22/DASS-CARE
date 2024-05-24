const DeviceManagement = artifacts.require("DeviceManagement");

contract("DeviceManagement", accounts => {
  let deviceManagementInstance;
  const owner = accounts[0];
  const deviceAddress = accounts[1];
  const deviceName = "Device 1";
  const deviceType = "Type A";

  beforeEach(async () => {
    deviceManagementInstance = await DeviceManagement.new({ from: owner });
  });

  it("should register a new device", async () => {
    // Enregistrer un nouveau dispositif
    await deviceManagementInstance.registerDevice(deviceAddress, deviceName, deviceType, { from: owner });

    // Vérifier si le dispositif a été enregistré correctement
    const device = await deviceManagementInstance.devices(deviceAddress);
    expect(device.name).to.equal(deviceName);
    expect(device.deviceType).to.equal(deviceType);
    expect(device.isActive).to.be.true;
  });
  
  it("should submit device data", async () => {
    // Enregistrer un nouveau dispositif
    await deviceManagementInstance.registerDevice(deviceAddress, deviceName, deviceType, { from: owner });

    // Soumettre des données depuis le dispositif enregistré
    const data = "Sample data from device";
    await deviceManagementInstance.submitDeviceData(data, { from: deviceAddress });

    // Vérifier si les données du dispositif ont été correctement soumises
    const events = await deviceManagementInstance.getPastEvents("DeviceDataReceived", { fromBlock: 0 });
    assert.equal(events.length, 1, "One DeviceDataReceived event should be emitted");

    const eventData = events[0].returnValues;
    assert.equal(eventData.deviceAddress, deviceAddress, "Device address in event should match");
    assert.equal(eventData.data, data, "Data in event should match");
});

});
