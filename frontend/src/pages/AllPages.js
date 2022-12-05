import React, { Suspense, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import AuthContext from "../context/auth-context";
// import UserProfilePage from "./UserProfilePage";
// import AuthPage from "./AuthPage";
// import Invoices from "./Invoices";
import InvoiceDetail from "./InvoiceDetail";
import ProtectedRoutes from "./ProtectedRoutes";
// import CreateNewUserPage from "./CreateNewUserPage";
// import CreateCompanyPage from "./CreateCompany";

const AllPages = () => {
  const authCtx = useContext(AuthContext);
  const { isLoggedIn } = authCtx;

  const AuthPage = React.lazy(() => import("./AuthPage"));
  const Invoices = React.lazy(() => import("./Invoices"));
  //const InvoiceDetail = React.lazy(() => import("./InvoiceDetail"));
  const CreateCompanyPage = React.lazy(() => import("./CreateCompany"));
  const UserProfilePage = React.lazy(() => import("./UserProfilePage"));
  // const CreateNewUserPage = React.lazy(() => import("./CreateNewUserPage"));
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route
          path="/loggin"
          element={isLoggedIn ? <Navigate to="/invoice" /> : <AuthPage />}
        />
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/invoice" /> : <AuthPage />}
        />
        <Route element={<ProtectedRoutes />}>
          <Route
            path="/invoice"
            element={isLoggedIn ? <Invoices /> : <AuthPage />}
          />
          <Route path="/invoice/*" element={<Invoices />} />
          <Route path="/invoice/:invoiceId/*" element={<InvoiceDetail />} />
          <Route path="/profile/*" element={<UserProfilePage />} />
          <Route path="/create-company" element={<CreateCompanyPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
export default AllPages;
