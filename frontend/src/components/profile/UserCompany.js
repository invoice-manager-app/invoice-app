import { useState, memo, Fragment } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import CompanyDetail from "../company/CompanyDetail";
import DeleteIcon from "../icons/DeleteIcon";
import classes from "./UserCompany.module.css";
import Notification from "../UI/Notification";
const UserCompany = ({
  companies,
  deleteCompany,
  submitEditedCompany,
  editCompany,
  editUser,
  editCompanyHandeler,
}) => {
  const [showCard, setShowCard] = useState(true);

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
      {notification && notification.message !== undefined && <Notification />}

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
                  <span
                    className={classes.deleteBtn}
                    onClick={() =>
                      deleteCompany(company.slug, company.name, company.email)
                    }
                  >
                    <DeleteIcon />
                  </span>
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
                  editCompanyHandeler={editCompanyHandeler}
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
