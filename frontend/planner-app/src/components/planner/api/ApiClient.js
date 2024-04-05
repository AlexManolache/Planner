import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL

export const apiClient = axios.create({
  baseURL: apiUrl,
});
