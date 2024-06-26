import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import EditComapnyInfo from "../components/company/EditCompanyInfo";
import LoadingSpinner from "../components/UI/LoadingSpinner";
// import UserProfilePage from "./UserProfilePage";
// import AuthPage from "./AuthPage";
// import Invoices from "./Invoices";
import InvoiceDetail from "./InvoiceDetail";
import ProtectedRoutes from "./ProtectedRoutes";
import { useSelector } from "react-redux";
// import CreateNewUserPage from "./CreateNewUserPage";
// import CreateCompanyPage from "./CreateCompany";

const AllPages = () => {
  const { isAuth } = useSelector((state) => state.authReducer);

  const AuthPage = React.lazy(() => import("./AuthPage"));
  const Invoices = React.lazy(() => import("./Invoices"));
  const CompanyListsPage = React.lazy(() => import("./CompanyListsPage"));
  const UserInfoPage = React.lazy(() => import("./UserInfoPage"));
  //const InvoiceDetail = React.lazy(() => import("./InvoiceDetail"));
  const CreateCompanyPage = React.lazy(() => import("./CreateCompany"));
  const UserProfilePage = React.lazy(() => import("./UserProfilePage"));
  // const CreateNewUserPage = React.lazy(() => import("./CreateNewUserPage"));
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route
          path="/loggin"
          element={isAuth ? <Navigate to="/invoice" /> : <AuthPage />}
        />
        <Route
          path="/"
          element={isAuth ? <Navigate to="/invoice" /> : <AuthPage />}
        />
        <Route element={<ProtectedRoutes />}>
          <Route
            path="/invoice"
            element={isAuth ? <Invoices /> : <AuthPage />}
          />
          <Route path="/invoice/*" element={<Invoices />} />
          <Route path="/invoice/:invoiceId/*" element={<InvoiceDetail />}>
            <Route path="edit-form/" element={<EditComapnyInfo />} />
          </Route>
          <Route path="/profile/*" element={<UserProfilePage />}>
            <Route path="companies/*" element={<CompanyListsPage />} />
            <Route path="user" element={<UserInfoPage />} />
          </Route>

          <Route path="/create-company" element={<CreateCompanyPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
export default AllPages;
