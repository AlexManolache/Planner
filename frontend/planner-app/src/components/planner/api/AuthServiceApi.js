import { apiClient } from "./ApiClient";

const endpointToken = process.env.REACT_APP_ENDPOINT_TOKEN;

export const executeJwtAuth = (username, password) =>
apiClient.post(endpointToken, {
  username,
  password,
});