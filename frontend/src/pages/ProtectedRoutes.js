import { Fragment } from "react";

import Wrapper from "../components/UI/Wrapper";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = () => {
  const { isAuth } = useSelector((state) => state.authReducer);
  return (
    <Fragment>
      {isAuth === true && (
        <Wrapper>
          <Outlet />
        </Wrapper>
      )}
      {isAuth === false && <Navigate to="/loggin" />}
      {/* {isAuth === null && <Navigate to="/login" />} */}
    </Fragment>
  );
};

export default ProtectedRoutes;
