// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
contract DeviceManagement {
    address public owner;

    struct Device {
        string name;
        string deviceType;
        bool isActive;
    }

    mapping(address => Device) public devices;

    event DeviceRegistered(address deviceAddress, string name, string deviceType);
    event DeviceDataReceived(address deviceAddress, string data);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this operation");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerDevice(address _deviceAddress, string memory _name, string memory _deviceType) public onlyOwner {
        require(!deviceExists(_deviceAddress), "Device already registered");
        Device storage newDevice = devices[_deviceAddress];
        newDevice.name = _name;
        newDevice.deviceType = _deviceType;
        newDevice.isActive = true;
        emit DeviceRegistered(_deviceAddress, _name, _deviceType);
    }

    function submitDeviceData(string memory _data) public {
        require(deviceExists(msg.sender), "Device not registered");
        emit DeviceDataReceived(msg.sender, _data);
    }

    function deviceExists(address _deviceAddress) public view returns (bool) {
        return devices[_deviceAddress].isActive;
    }
}
