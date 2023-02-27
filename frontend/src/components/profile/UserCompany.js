import { useState, memo, Fragment, useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CompanyDetail from "../company/CompanyDetail";
import classes from "./UserCompany.module.css";
import Notification from "../UI/Notification";
import PlusIcon from "../icons/PlusIcon";
import LoadingSpinner from "../UI/LoadingSpinner";
import { getCompanies } from "../../store/company-slice";
import { uiActions } from "../../store/Ui-slice";
import { deleteCompany } from "../../store/action-creator";
const UserCompany = () => {
  let { token } = useSelector((state) => state.authReducer);

  const [showCard, setShowCard] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  //all companies
  const data = useSelector((state) => state.companiesReducer.allCompanies);
  //UI actions
  const editUser = useSelector((state) => state.ui.editUser);
  const editCompany = useSelector((state) => state.ui.editCompany);

  //loading state
  const isLoading = useSelector((state) => state.companiesReducer.isLoading);

  //get all companies
  useEffect(() => {
    dispatch(getCompanies(token));
  }, [dispatch]);

  //delete company
  const deleteHandler = (slug, name, email) => {
    let token = localStorage.getItem("token");

    dispatch(uiActions.hideDeleteConfirm());
    dispatch(deleteCompany(token, name, email, slug));
    navigate("/profile");
  };

  //switch into edit company info

  const editCompanyHandeler = () => {
    dispatch(uiActions.editCompanyInfo());
  };

  //notification state
  const notification = useSelector((state) => state.ui.notification);

  const showCompanyInfoHandeler = () => {
    setShowCard(false);
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
                      to={`/profile/companies/${company.id}`}
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
                  editCompany={editCompany}
                  editUser={editUser}
                  deleteCompany={deleteHandler}
                  editCompanyHandeler={editCompanyHandeler}
                  setShowCard={setShowCard}
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
