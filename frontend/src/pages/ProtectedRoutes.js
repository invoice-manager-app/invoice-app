import React, { Fragment, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Wrapper from "../components/UI/Wrapper";
import AuthContext from "../context/auth-context";

const ProtectedRoutes = () => {
  const authCtx = useContext(AuthContext);
  const { isLoggedIn } = authCtx;

  return (
    <Fragment>
      {isLoggedIn ? (
        <Wrapper>
          {" "}
          <Outlet />
        </Wrapper>
      ) : (
        <Navigate to="/loggin" />
      )}
    </Fragment>
  );
};

export default ProtectedRoutes;
