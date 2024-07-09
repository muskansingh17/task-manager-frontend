import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { verifyToken } from "../slices/user.slice";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  // const status = useSelector((state) => state.user.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    const isLoginPage = window.location.pathname === "/login";
    const isRegisterPage = window.location.pathname === "/register";

    if ((isLoginPage || isRegisterPage) && isAuthenticated) {
      navigate('/')
    }

    if (!isAuthenticated && authToken) {
      dispatch(verifyToken());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isAuthenticated]);

  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }

  // Redirect to login if not authenticated and not on login or register page
  if (
    !isAuthenticated &&
    !["/login", "/register"].includes(window.location.pathname)
  ) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
