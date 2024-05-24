// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
contract UserManagement {
    address public owner;
    
    enum Role { Unknown, Doctor, Nurse, Pharmacist, Patient }
    
    struct User {
        string name;
        Role role;
        bool isActive;
        mapping(address => bool) authorizedUsers;
    }
    
    mapping(address => User) public users;
    
    event UserRegistered(address userAddress, string name, Role role);
    event AuthorizationGranted(address owner, address authorizedUser);
    event AuthorizationRevoked(address owner, address unauthorizedUser);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this operation");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
   function registerUser(address _userAddress, string memory _name, Role _role) public onlyOwner {
    require(!userExists(_userAddress), "User already registered");
    
    // Créer une nouvelle structure User
    User storage newUser = users[_userAddress];
    newUser.name = _name;
    newUser.role = _role;
    newUser.isActive = true;

    // Initialiser la mapping authorizedUsers
    // Notez que vous n'avez pas besoin de l'initialiser si vous n'avez pas besoin d'ajouter d'utilisateurs autorisés lors de l'inscription
    // Dans ce cas, vous pouvez supprimer cette étape
    // newUser.authorizedUsers = ...;

    emit UserRegistered(_userAddress, _name, _role);
}
    function grantAuthorization(address _owner, address _authorizedUser) public onlyOwner {
        require(userExists(_owner), "Owner does not exist");
        require(userExists(_authorizedUser), "Authorized user does not exist");
        require(users[_owner].isActive, "Owner account is not active");
         if (!userExists(_authorizedUser)) {
        // Ajouter l'utilisateur autorisé au tableau des utilisateurs autorisés
        users[_owner].authorizedUsers[_authorizedUser] = true;
        emit UserRegistered(_authorizedUser, "", Role.Unknown); // Ajouter un événement pour signaler l'ajout automatique
    }
        users[_owner].authorizedUsers[_authorizedUser] = true;
        emit AuthorizationGranted(_owner, _authorizedUser);
    }
    
    function revokeAuthorization(address _owner, address _unauthorizedUser) public onlyOwner {
        require(userExists(_owner), "Owner does not exist");
        require(userExists(_unauthorizedUser), "Unauthorized user does not exist");
        require(users[_owner].isActive, "Owner account is not active");
        users[_owner].authorizedUsers[_unauthorizedUser] = false;
        emit AuthorizationRevoked(_owner, _unauthorizedUser);
    }
    
    function userExists(address _userAddress) public view returns (bool) {
        return users[_userAddress].isActive;
    }
}
