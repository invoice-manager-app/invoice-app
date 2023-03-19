import { useCallback, memo, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { uiActions } from "../../store/Ui-slice";

import EditUserInfo from "../user/EditUserInfo";
import ChangeUserPassword from "./ChangeUserPassword";

//style
import classes from "./Profile.module.css";
import EditIcon from "../icons/EditIcon";
import Notification from "../UI/Notification";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Aside from "./Aside";

//get companies
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const data = useSelector((state) => state.companiesReducer.allCompanies);

  const CompanyId = data && data.map((el) => el.id);
  //user info after update
  const editedInfo = useSelector((state) => state.action.userInfo);
  //UI actions
  const editUser = useSelector((state) => state.ui.editUser);
  const editCompany = useSelector((state) => state.ui.editCompany);

  //notification state
  const notification = useSelector((state) => state.ui.notification);

  //switchUser
  //const switchInfo = useSelector((state) => state.ui.switchInfo);
  //change password
  const changePassword = useSelector((state) => state.ui.changePassword);

  //switch into edit user Info Component
  const editUserHandeler = () => {
    dispatch(uiActions.toggleUser());
  };

  //switch into change password components
  const { pathname } = location;

  const changePasswordHandler = useCallback(() => {
    dispatch(uiActions.togglePassword());
  }, [dispatch]);

  //switch into user Info
  const basicInfoHandler = useCallback(() => {
    navigate("/profile/user");
    if (pathname === "/profile/user") return;
  }, [navigate, pathname]);

  //switch into company Info
  const companyInfoHandler = useCallback(() => {
    if (data && CompanyId) {
      for (let i = 0; i < CompanyId.length; i++) {
        if (pathname.includes(CompanyId[i])) return;
      }
    }

    navigate("/profile/companies");
  }, [navigate, pathname, CompanyId, data]);

  const basicInfoBtnClass =
    location.pathname === "/profile/user" ? classes.active : "";
  const companyInfoBtnClass = location.pathname.includes("companies")
    ? classes.active
    : "";

  return (
    <Fragment>
      {notification &&
        notification.message !== null &&
        notification.message !== undefined && <Notification />}

      <section className={classes.profile}>
        <main className={classes.content}>
          {!editUser && !changePassword && (
            <Aside
              basicInfoHandler={basicInfoHandler}
              companyInfoBtnClass={companyInfoBtnClass}
              companyInfoHandler={companyInfoHandler}
              basicInfoBtnClass={basicInfoBtnClass}
            />
          )}

          <div className={classes.conainer}>
            {editUser && location.pathname.includes("user") && (
              <EditUserInfo userData={editedInfo} />
            )}

            {/* <UserCompany />

            <UserProfile /> */}
            {!editUser && !changePassword && <Outlet />}

            {changePassword && <ChangeUserPassword />}
            <div className={classes.actions}>
              {!changePassword && location.pathname === "/profile/user" && (
                <button
                  onClick={editUserHandeler}
                  className={editUser ? classes.cancel : classes.edit}
                >
                  {!editUser && <EditIcon />}{" "}
                  {editUser ? "Cancel" : "Edit User"}
                </button>
              )}

              {!editCompany &&
                !editUser &&
                location.pathname === "/profile/user" && (
                  <button
                    className={
                      changePassword
                        ? classes.cancel
                        : classes["change_password"]
                    }
                    onClick={changePasswordHandler}
                  >
                    {changePassword ? "Cancel" : "Change Password"}
                  </button>
                )}
            </div>
          </div>
        </main>
      </section>
    </Fragment>
  );
};
export default memo(Profile);
