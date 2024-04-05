import { createContext, useContext, useState } from "react";
import { executeJwtAuth } from "../api/AuthServiceApi";

import { apiClient } from "../api/ApiClient";

export const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};
export default function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  // eslint-disable-next-line
  const [username, setUsername] = useState(null);
  const [updatePlan, setUpdatePlan] = useState(false);
  // eslint-disable-next-line
  const [token, setToken] = useState("");


  async function login(username, password) {
    try {
      const response = await executeJwtAuth(username, password);
      
      if (response.status === 200) {
        const jwtToken = 'Bearer ' + response.data.token;
        setIsAuth(true);
        setUsername(username);
        setToken(jwtToken);
        apiClient.interceptors.request.use((config) => {
          config.headers.Authorization = jwtToken;
          return config;
        });
        return true;
      } else {
        setIsAuth(false);
        setToken(null);
        return false;
      }
    } catch (err) {
      setToken(null);
      setIsAuth(false);
      setUsername(null);
    }
  }

  function logout() {
    setIsAuth(false);
    setUsername(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        setIsAuth,
        login,
        logout,
        username,
        updatePlan,
        setUpdatePlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
