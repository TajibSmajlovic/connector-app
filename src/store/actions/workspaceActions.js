import * as actionType from "./actionTypes";

// Sets workspace on global state
export const setWorkspace = workspace => {
  return {
    type: actionType.SET_WORKSPACE,
    payload: {
      workspace: workspace
    }
  };
};
