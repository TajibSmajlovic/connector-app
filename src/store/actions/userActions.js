import * as actionType from "./actionTypes";

// Returns type and data that our state needs to be changed with
// Accepts user data and returns and object with type and payload
export const setUser = user => {
  return {
    type: actionType.SET_USER,
    payload: {
      currentUser: user
    }
  };
};

export const clearUser = () => {
  return {
    type: actionType.CLEAR_USER
  };
};
