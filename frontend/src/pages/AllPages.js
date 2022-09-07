import React, { Suspense, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import AuthContext from "../context/auth-context";
// import UserProfilePage from "./UserProfilePage";
// import AuthPage from "./AuthPage";
// import Invoices from "./Invoices";
import InvoiceDetail from "./InvoiceDetail";
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
  const CreateNewUserPage = React.lazy(() => import("./CreateNewUserPage"));
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route
          path="/auth"
          element={
            !isLoggedIn ? <AuthPage /> : <Navigate to="/invoice" replace />
          }
        />

        <Route
          path="/invoice/*"
          element={isLoggedIn ? <Invoices /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/invoice/:invoiceId"
          element={isLoggedIn && <InvoiceDetail />}
        />
        <Route
          path="/profile"
          element={
            isLoggedIn ? <UserProfilePage /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/create-user"
          element={
            isLoggedIn ? <CreateNewUserPage /> : <Navigate to="/auth" replace />
          }
        />

        <Route
          path="/create-company"
          element={
            isLoggedIn ? <CreateCompanyPage /> : <Navigate to="/auth" replace />
          }
        />
        <Route path="/" element={!isLoggedIn ? <AuthPage /> : <Invoices />} />
        <Route path="*" element={<Navigate to="/invoice" replace />} />
      </Routes>
    </Suspense>
  );
};
export default AllPages;
