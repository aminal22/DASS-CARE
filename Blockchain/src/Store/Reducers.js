// Reducer for managing provider and account
export const Provider = (state = {}, action) => {
  switch (action.type) {
    case "PROVIDER_LOADED":
      return {
        ...state,
        connection: action.connection,
      };
    case "NETWORK_LOADED":
      return {
        ...state,
        chainId: action.chainId,
      };
    case "ACCOUNT_LOADED":
      return {
        ...state,
        account: action.account,
      };
    default:
      return state;
  }
};

// Default state for MedicalStorage
const DEFAULT_MEDICALSTORAGE_STATE = {
  loaded: false,
  contract: {},
  transaction: {
    isSuccessful: false,
    isPending: false,
    isError: false,
  },
  events: [],
};

// Reducer for managing MedicalStorage contract state and transaction states
export const MedicalStorage = (state = DEFAULT_MEDICALSTORAGE_STATE, action) => {
  switch (action.type) {
    case "MEDICALSTORAGE_LOADED":
      return {
        ...state,
        loaded: true,
        contract: action.medicalStorage,
      };
    case "ADD_DOCTOR_INITIALIZED":
      return {
        ...state,
        transaction: {
          isSuccessful: false,
          isPending: true,
          isError: false,
        },
      };
    case "ADD_DOCTOR_SUCCESS":
      return {
        ...state,
        transaction: {
          isSuccessful: true,
          isPending: false,
          isError: false,
        },
        events: [action.event, ...state.events],
      };
    case "ADD_DOCTOR_FAIL":
      return {
        ...state,
        transaction: {
          isSuccessful: false,
          isPending: false,
          isError: true,
        },
      };

    // Additional cases can be added here for other transaction types

    default:
      return state;
  }
};
