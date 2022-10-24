import { useState, memo, Fragment, useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CompanyDetail from "../company/CompanyDetail";
import classes from "./UserCompany.module.css";
import Notification from "../UI/Notification";
const UserCompany = ({
  deleteCompany,
  submitEditedCompany,
  editCompany,
  editUser,
  editCompanyHandeler,
}) => {
  const [showCard, setShowCard] = useState(true);
  const [companies, setCompanies] = useState([]);

  //dispatch
  const dispatch = useDispatch();

  //getAllCompanies
  const getAllCompanies = async (token) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(
      "http://127.0.0.1:8000/company/",
      requestOptions
    );
    const data = await response.json();
    setCompanies(data);
  };
  useEffect(() => {
    let token;
    if (localStorage.getItem("token")) {
      token = localStorage.getItem("token");
    }

    getAllCompanies(token);
    console.log("GET-COMPANIES");
  }, [dispatch]);

  //notification state
  const notification = useSelector((state) => state.ui.notification);

  const showCompanyInfoHandeler = () => {
    setShowCard(false);
  };
  const hideCompanyInfoHandeler = () => {
    setShowCard(true);
  };

  if (companies.length === 0) {
    return (
      <section>
        <h1> No Companies are found </h1>
        <Link
          style={{
            display: "inline-block",
            textDecoration: "underline",
            marginTop: "30px",
          }}
          to="/create-company"
        >
          Add New Company ?
        </Link>
      </section>
    );
  }

  return (
    <Fragment>
      {notification &&
        notification.message !== null &&
        notification.message !== undefined && <Notification />}

      <div className={classes["company-info"]}>
        {companies.map((company) => {
          return (
            <div key={company.id}>
              {showCard && (
                <div className={classes["card-container"]}>
                  <div className={classes.card}>{company.name}</div>
                  <Link
                    to={`/profile/${company.id}`}
                    className={classes.card_btn}
                    onClick={showCompanyInfoHandeler}
                  >
                    Show Full Information
                  </Link>
                </div>
              )}
            </div>
          );
        })}
        {!showCard && (
          <Routes>
            <Route
              element={
                <CompanyDetail
                  companies={companies}
                  backHandler={hideCompanyInfoHandeler}
                  submitEditedCompany={submitEditedCompany}
                  editCompany={editCompany}
                  editUser={editUser}
                  deleteCompany={deleteCompany}
                  editCompanyHandeler={editCompanyHandeler}
                  getAllCompanies={getAllCompanies}
                />
              }
              path="/:companyId/*"
            />
          </Routes>
        )}
      </div>
    </Fragment>
  );
};
export default memo(UserCompany);
