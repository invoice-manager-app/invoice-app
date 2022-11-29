import { useState, memo, Fragment, useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CompanyDetail from "../company/CompanyDetail";
import classes from "./UserCompany.module.css";
import Notification from "../UI/Notification";
import PlusIcon from "../icons/PlusIcon";
import LoadingSpinner from "../UI/LoadingSpinner";
import { getCompanies } from "../../store/company-slice";
const UserCompany = ({
  deleteCompany,
  editCompany,
  editUser,
  editCompanyHandeler,
}) => {
  const [showCard, setShowCard] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  //all companies
  const data = useSelector((state) => state.companiesReducer.allCompanies);

  //loading state
  const isLoading = useSelector((state) => state.companiesReducer.isLoading);

  //get all companies
  useEffect(() => {
    let token;
    if (localStorage.getItem("token")) {
      token = localStorage.getItem("token");
    }
    console.log("get companies");
    dispatch(getCompanies(token));
  }, [dispatch]);

  //notification state
  const notification = useSelector((state) => state.ui.notification);

  const showCompanyInfoHandeler = () => {
    setShowCard(false);
  };
  const hideCompanyInfoHandeler = () => {
    setShowCard(true);
  };

  //navigate to create company page

  const createCompanyHandler = () => {
    navigate("/create-company");
  };

  if (data && data.length === 0) {
    return (
      <section>
        <h1> No Companies are found </h1>
        <button className={classes.addBtn} onClick={createCompanyHandler}>
          <PlusIcon />
          <span> Add New Company ?</span>
        </button>
      </section>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Fragment>
      {notification &&
        notification.message !== null &&
        notification.message !== undefined && <Notification />}

      <div className={classes["company-info"]}>
        {data &&
          data.map((company) => {
            return (
              <div key={company.id}>
                {showCard && (
                  <div className={classes["card-container"]}>
                    <div className={classes.avatar}>
                      <img src={company.avatar} alt={company.name} />
                    </div>
                    <div className={classes.card}>{company.name}</div>

                    <Link
                      to={`/profile/${company.id}`}
                      className={classes.card_btn}
                      onClick={showCompanyInfoHandeler}
                    >
                      More...
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
                  companies={data}
                  backHandler={hideCompanyInfoHandeler}
                  editCompany={editCompany}
                  editUser={editUser}
                  deleteCompany={deleteCompany}
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
