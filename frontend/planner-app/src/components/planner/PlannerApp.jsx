import "./PlannerApp.css";
import Logout from "./Logout";
import Login from "./Login";
import Welcome from "./Welcome";
import ErrorMessage from "./ErrorMessage";
import HeaderComp from "./HeaderComp";
import PlannerList from "./PlannerList";
import FooterComp from "./FooterComp";
import PlanForm from "./PlanForm";
import AuthProvider, { useAuth } from "./security/AuthContext";

import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function PlannerApp() {
  function AuthRoute({ children }) {
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
      if (!auth.isAuth) {
        navigate("/login");
      }
    }, [auth.isAuth, navigate]);

    return auth.isAuth ? children : null;
  }

  return (
    <div className="plannerApp">
      <AuthProvider>
        <BrowserRouter>
          <HeaderComp />
          <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route
              path="/logout"
              element={
                <AuthRoute>
                  <Logout />
                </AuthRoute>
              }
            ></Route>
            <Route
              path="/welcome/:username"
              element={
                <AuthRoute>
                  <Welcome />
                </AuthRoute>
              }
            ></Route>
            <Route
              path="/plans"
              element={
                <AuthRoute>
                  <PlannerList />
                </AuthRoute>
              }
            ></Route>
            <Route
              path="/plans/add"
              element={
                <AuthRoute>
                  <PlanForm />
                </AuthRoute>
              }
            ></Route>
            <Route
              path="/plans/:id/update"
              element={
                <AuthRoute>
                  <PlanForm />
                </AuthRoute>
              }
            ></Route>
            <Route path="*" element={<ErrorMessage />}></Route>
          </Routes>
          <FooterComp />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
