import { useState, useCallback, memo, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { uiActions } from "../../store/Ui-slice";
import UserCompany from "./UserCompany";
import UserProfile from "./UserProfile";
import EditUserInfo from "../user/EditUserInfo";
import ChangeUserPassword from "./ChangeUserPassword";

//style
import classes from "./Profile.module.css";
import EditIcon from "../icons/EditIcon";
import { deleteCompany, editCompanyFn } from "../../store/action-creator";
import Notification from "../UI/Notification";
import { useNavigate } from "react-router-dom";
import Aside from "./Aside";

//get companies

const Profile = () => {
  const dispatch = useDispatch();

  let token;
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
  }
  const navigate = useNavigate();

  //UI actions
  const editUser = useSelector((state) => state.ui.editUser);
  const editCompany = useSelector((state) => state.ui.editCompany);

  //user info after update
  const editedInfo = useSelector((state) => state.action.userInfo);
  //const [changePassword, setChangePassword] = useState(false);
  // const [switchInfo, setSwitchInfo] = useState(false);
  const [userData, setUserData] = useState([
    { username: "", first_name: "", last_name: "", email: "" },
  ]);

  //notification state
  const notification = useSelector((state) => state.ui.notification);

  //switchUser
  const switchInfo = useSelector((state) => state.ui.switchInfo);
  //change password
  const changePassword = useSelector((state) => state.ui.changePassword);

  //delete company
  const deleteHandler = useCallback(
    (slug, name, email) => {
      dispatch(uiActions.hideDeleteConfirm());
      dispatch(deleteCompany(token, name, email, slug));
      navigate("/profile");
    },
    [dispatch, token, navigate]
  );

  //edit company
  // const submitEditedCompany = useCallback(
  //   (values, slug, imgSrc) => {
  //     dispatch(editCompanyFn(token, values, slug, imgSrc));
  //   },
  //   [dispatch, token]
  // );

  //switch into edit user Info Component
  const editUserHandeler = () => {
    dispatch(uiActions.toggleUser());
  };

  //switch into edit company info

  const editCompanyHandeler = () => {
    dispatch(uiActions.editCompanyInfo());
  };

  //switch into change password components

  const changePasswordHandler = useCallback(() => {
    dispatch(uiActions.togglePassword());
  }, [dispatch]);

  //switch into user Info
  const basicInfoHandler = useCallback(() => {
    dispatch(uiActions.switchToUserInfo());
  }, [dispatch]);

  //switch into company Info
  const companyInfoHandler = useCallback(() => {
    dispatch(uiActions.switchToCompany());
    dispatch(uiActions.submitUser());
    dispatch(uiActions.submitEditCompanyInfo());
    //dispatch(uiActions.togglePassword());
  }, [dispatch]);

  const basicInfoBtnClass = switchInfo ? "" : classes.active;
  const companyInfoBtnClass = switchInfo ? classes.active : "";

  return (
    <Fragment>
      {notification &&
        notification.message !== null &&
        notification.message !== undefined && <Notification />}

      <section className={classes.profile}>
        <main className={classes.content}>
          {!changePassword && (
            <Aside
              basicInfoHandler={basicInfoHandler}
              companyInfoBtnClass={companyInfoBtnClass}
              companyInfoHandler={companyInfoHandler}
              basicInfoBtnClass={basicInfoBtnClass}
            />
          )}

          <div className={classes.conainer}>
            {!switchInfo && !editUser && !changePassword && (
              <UserProfile userData={userData} setUserData={setUserData} />
            )}
            {editUser && <EditUserInfo userData={editedInfo} />}

            {switchInfo && !editUser && !editCompany && !changePassword && (
              <UserCompany
                deleteCompany={deleteHandler}
                editCompanyHandeler={editCompanyHandeler}
                editCompany={editCompany}
                editUser={editUser}
              />
            )}
            {changePassword && <ChangeUserPassword />}
            <div className={classes.actions}>
              {!switchInfo && !changePassword && (
                <button
                  onClick={editUserHandeler}
                  className={editUser ? classes.cancel : classes.edit}
                >
                  {!editUser && <EditIcon />}{" "}
                  {editUser ? "Cancel" : "Edit User"}
                </button>
              )}

              {!editCompany && !editUser && !switchInfo && (
                <button
                  className={
                    changePassword ? classes.cancel : classes["change_password"]
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
