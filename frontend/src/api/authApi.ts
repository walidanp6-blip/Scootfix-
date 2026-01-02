import apiClient from "./apiClient";

interface UserInput {
  username: string;
  password: string;
}

export const register = (data: UserInput) =>
  apiClient.post("/register", data);

export const login = (data: UserInput) =>
  apiClient.post("/token", data);