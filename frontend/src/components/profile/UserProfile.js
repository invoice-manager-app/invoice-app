import { useState } from "react";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { AiOutlineArrowRight } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import classes from "./UserProfile.module.css";
import EditUserInfo from "../user/EditUserInfo";
import { uiActions } from "../store/Ui-slice";
import EditComapnyInfo from "../company/EditCompanyInfo";
import { Link } from "react-router-dom";
import ChangeUserPassword from "./ChangeUserPassword";
const UserProfile = () => {
  const dispatch = useDispatch();
  const [switchInfo, setSwitchInfo] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const editUser = useSelector((state) => state.ui.editUser);
  let editCompanyForm = useSelector((state) => state.ui.editCompany);
  let detailObj = "";
  const companyInfo = useSelector((state) => state.action.companyInfo);

  for (let i = 0; i < companyInfo.length; i++) {
    detailObj = companyInfo[i];
  }

  let userObj = "";
  const userInfo = useSelector((state) => state.action.userInfo);

  for (let i = 0; i < userInfo.length; i++) {
    userObj = userInfo[i];
  }

  const basicInfoHandler = () => {
    setSwitchInfo(false);
    dispatch(uiActions.submitUser());
    dispatch(uiActions.submitEditCompanyInfo());
    setChangePassword(false);
  };
  const companyInfoHandler = () => {
    setSwitchInfo(true);
    dispatch(uiActions.submitUser());
    dispatch(uiActions.submitEditCompanyInfo());
    setChangePassword(false);
  };

  const showCompanyInfoHandeler = () => {
    setShowCard(true);
  };
  const hideCompanyInfoHandeler = () => {
    setShowCard(false);
  };

  const editUserHandeler = () => {
    dispatch(uiActions.toggleUser());
  };
  const editCompanyHandeler = () => {
    dispatch(uiActions.toggleCompany());
  };

  const changePasswordHandler = () => {
    setChangePassword((prevState) => !prevState);
  };

  const basicInfoBtnClass = switchInfo ? "" : classes.active;
  const companyInfoBtnClass = switchInfo ? classes.active : "";
  return (
    <section className={classes["user-profile"]}>
      <div className={classes.content}>
        <aside className={classes.aside}>
          <ul>
            <li className={basicInfoBtnClass} onClick={basicInfoHandler}>
              Basic Info
            </li>
            <li className={companyInfoBtnClass} onClick={companyInfoHandler}>
              Company
            </li>
          </ul>
        </aside>
        {!changePassword && (
          <div className={classes["profile-content"]}>
            <div>
              <div className={classes.info}>
                {!switchInfo ? (
                  <h3> Personal details</h3>
                ) : (
                  <h3>Company Info</h3>
                )}
                {!switchInfo && !editUser && (
                  <div>
                    <div>
                      <h4>E-mail</h4>
                      <span> {userObj.email} </span>
                    </div>
                    <div>
                      <h4>User Name</h4>
                      <span> {userObj.userName} </span>
                    </div>
                    <div>
                      <h4>First Name</h4>
                      <span> {userObj.firstName} </span>
                    </div>
                    <div>
                      <h4>Last Name</h4>
                      <span> {userObj.lastName} </span>
                    </div>
                  </div>
                )}
                {editUser && <EditUserInfo id={userObj.id} />}
                {switchInfo && (
                  <div className={classes["company-info"]}>
                    {!showCard && (
                      <div className={classes.card}>
                        <span
                          onClick={showCompanyInfoHandeler}
                          className={classes.card_btn}
                        >
                          {detailObj.companyName}{" "}
                        </span>
                      </div>
                    )}
                    {showCard && (
                      <div>
                        {!editCompanyForm && (
                          <div>
                            <div>
                              <h4>Company Name</h4>
                              <span> {detailObj.companyName}</span>
                            </div>
                            <div>
                              <h4>Owner</h4>
                              <span> {detailObj.owner}</span>
                            </div>
                            <div>
                              <h4>About</h4>
                              <span> {detailObj.about}</span>
                            </div>
                            <div>
                              <h4>Email</h4>
                              <span>{detailObj.email}</span>
                            </div>
                            <div>
                              <h4>Number</h4>
                              <span> {detailObj.number} </span>
                            </div>
                            <div>
                              <h4>Address</h4>
                              <span>{detailObj.address}</span>
                            </div>
                            <button
                              onClick={hideCompanyInfoHandeler}
                              className={classes.back}
                            >
                              <AiOutlineArrowRight />
                            </button>
                          </div>
                        )}
                        {editCompanyForm && (
                          <EditComapnyInfo id={detailObj.id} />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {changePassword && <ChangeUserPassword />}
      </div>
      {!switchInfo && !changePassword && (
        <button onClick={editUserHandeler} className={classes.edit}>
          <FiEdit /> {editUser ? "Cancle" : "Edit User"}
        </button>
      )}
      {switchInfo && showCard && (
        <button onClick={editCompanyHandeler} className={classes.edit}>
          <FiEdit /> {editCompanyForm ? "Cancle" : "Edit Company"}
        </button>
      )}

      <button
        className={classes["change_password"]}
        onClick={changePasswordHandler}
      >
        {changePassword ? "Back" : "Change Passworrd"}
      </button>
    </section>
  );
};

export default UserProfile;
