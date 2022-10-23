import {
  useState,
  useEffect,
  useContext,
  useCallback,
  memo,
  Fragment,
} from "react";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { uiActions } from "../../store/Ui-slice";
import { invoiceAction } from "../../store/actions";
import UserCompany from "./UserCompany";
import UserProfile from "./UserProfile";
import EditUserInfo from "../user/EditUserInfo";
import ChangeUserPassword from "./ChangeUserPassword";

//style
import classes from "./Profile.module.css";
import EditIcon from "../icons/EditIcon";
import AuthContext from "../../context/auth-context";
import { deleteCompany, editCompanyFn } from "../../store/action-creator";
import Notification from "../UI/Notification";
import { useNavigate } from "react-router-dom";

//get companies

const Profile = () => {
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);

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

  const [companies, setCompanies] = useState([]);

  let token;
  if (localStorage.getItem("token")) {
    token = localStorage.getItem("token");
  }

  //notification state
  const notification = useSelector((state) => state.ui.notification);

  //switchUser
  const switchInfo = useSelector((state) => state.ui.switchInfo);
  //change password
  const changePassword = useSelector((state) => state.ui.changePassword);

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const userInfo = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/account/view/",
        requestOptions
      );

      const data = await response.json();
      const { email, first_name, last_name, username } = data;

      if (response.status === 401) {
        authContext.logout();
      }

      dispatch(
        invoiceAction.editUser({
          username: username,
          last_name: last_name,
          first_name: first_name,
          email: email,
        })
      );
      setUserData({
        username,
        first_name,
        last_name,
        email,
      });
    };
    userInfo();
  }, [dispatch, token, authContext]);

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
  const submitEditedCompany = useCallback(
    (values, slug) => {
      dispatch(editCompanyFn(token, values, slug));
    },
    [dispatch, token]
  );
  //getAllCompanies
  useEffect(() => {
    const getAllCompanies = async () => {
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
    getAllCompanies();
  }, [token, notification, dispatch]);

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
    dispatch(uiActions.toggleUserInfo());
    //dispatch(uiActions.submitUser());
    // dispatch(uiActions.submitEditCompanyInfo());
    // dispatch(uiActions.togglePassword());
  }, [dispatch]);

  //switch into company Info
  const companyInfoHandler = useCallback(() => {
    dispatch(uiActions.toggleUserInfo());
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
            <aside className={classes.aside}>
              <ul>
                <li className={basicInfoBtnClass} onClick={basicInfoHandler}>
                  Basic Info
                </li>
                <li
                  className={companyInfoBtnClass}
                  onClick={companyInfoHandler}
                >
                  Company
                </li>
              </ul>
            </aside>
          )}

          {!switchInfo && !editUser && !changePassword && (
            <UserProfile userData={userData} />
          )}
          {editUser && <EditUserInfo userData={editedInfo} />}

          {switchInfo && !editUser && !editCompany && !changePassword && (
            <UserCompany
              companies={companies}
              deleteCompany={deleteHandler}
              editCompanyHandeler={editCompanyHandeler}
              submitEditedCompany={submitEditedCompany}
              editCompany={editCompany}
              editUser={editUser}
            />
          )}
        </main>
        {!switchInfo && !changePassword && (
          <button onClick={editUserHandeler} className={classes.edit}>
            <EditIcon /> {editUser ? "Back" : "Edit User"}
          </button>
        )}

        {changePassword && <ChangeUserPassword />}

        {!editCompany && !editUser && (
          <button
            className={classes["change_password"]}
            onClick={changePasswordHandler}
          >
            {changePassword ? "Back" : "Change Passworrd"}
          </button>
        )}
      </section>
    </Fragment>
  );
};
export default memo(Profile);
