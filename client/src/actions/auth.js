import * as api from "../api";
import { setCurrentUser } from "./currentUser";

export const login = (authData) => async (dispatch) => {
  try {
    const { data } = await api.login(authData);
    dispatch({ type: "AUTH", data });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("profile"))));
  } catch (error) {
    alert("Failed to login", error);
  }
};
