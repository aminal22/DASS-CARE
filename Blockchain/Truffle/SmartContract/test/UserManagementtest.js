const UserManagement1 = artifacts.require("UserManagement");

contract("UserManagement", accounts => {
  let userManagementInstance;

  beforeEach(async () => {
    userManagementInstance = await UserManagement1.new();
  });

  it("should register a new user", async () => {
    const userAddress = accounts[0];
    const userName = "John Doe";
    const userRole = 1; // Assign the role enum value (e.g., 1 for Doctor, 2 for Nurse, etc.)

    await userManagementInstance.registerUser(userAddress, userName, userRole, { from: accounts[0] });
    const user = await userManagementInstance.users(userAddress);

    assert.equal(user.name, userName, "User name should be John Doe");
    assert.equal(user.role, userRole, "User role should be 1 (Doctor)");
    assert.equal(user.isActive, true, "User should be active");
  });
  
});

const UserManagement2 = artifacts.require("UserManagement");

contract("UserManagement", accounts => {
  let userManagementInstance;
  const owner = accounts[0];
  const authorizedUser = accounts[1];

  beforeEach(async () => {
    userManagementInstance = await UserManagement2.new({ from: owner });
    // Enregistrer l'utilisateur autorisé
    await userManagementInstance.registerUser(authorizedUser, "Authorized User", 1, { from: owner });
    // Enregistrer un utilisateur pour effectuer les tests
    await userManagementInstance.registerUser(owner, "John Doe", 1, { from: owner });
  });

  it("should grant authorization to access medical data", async () => {
    // Vérifier si l'utilisateur autorisé est correctement enregistré
    const isAuthorizedUserRegistered = await userManagementInstance.userExists(authorizedUser);
    assert.equal(isAuthorizedUserRegistered, true, "Authorized user should be registered");

    // Vérifier si le propriétaire est correctement initialisé
    const isOwnerRegistered = await userManagementInstance.userExists(owner);
    assert.equal(isOwnerRegistered, true, "Owner should be registered");

    // Appeler la fonction pour accorder l'autorisation
    await userManagementInstance.grantAuthorization(owner, authorizedUser, { from: owner });

  
  });

  // Ajoutez d'autres tests ici pour les autres fonctions de votre contrat
});
const UserManagement3 = artifacts.require("UserManagement");

contract("UserManagement", accounts => {
  let userManagementInstance;
  const owner = accounts[0];
  const unauthorizedUser = accounts[1];

  beforeEach(async () => {
    userManagementInstance = await UserManagement3.new({ from: owner });
    // Enregistrer un utilisateur pour effectuer les tests
    await userManagementInstance.registerUser(owner, "John Doe", 1, { from: owner });
    await userManagementInstance.registerUser(unauthorizedUser, "Unauthorized User", 2, { from: owner });
    // Accorder une autorisation à l'utilisateur non autorisé
    await userManagementInstance.grantAuthorization(owner, unauthorizedUser, { from: owner });
  });

  it("should revoke authorization to access medical data", async () => {
    // Vérifier si le propriétaire est correctement initialisé
    const isOwnerRegistered = await userManagementInstance.userExists(owner);
    assert.equal(isOwnerRegistered, true, "Owner should be registered");

    
    // Révoquer l'autorisation de l'utilisateur non autorisé
    await userManagementInstance.revokeAuthorization(owner, unauthorizedUser, { from: owner });

  
  });

  // Ajoutez d'autres tests ici pour les autres fonctions de votre contrat
});
