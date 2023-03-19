import { useLocation, useNavigate } from "react-router-dom";

import classes from "./Header.module.css";
import CaseIcon from "../icons/CaseIcon";
import HomeIcon from "../icons/HomeIcon";
import UserIcon from "../icons/UserIcon";
import LogoutIcon from "../icons/LogoutIcon";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import ConfirmationModel from "../UI/ConfirmationModel";
import { Fragment } from "react";
const Header = () => {
  const { isAuth } = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const homeDirectHandeler = () => {
    navigate("/invoice");
  };
  const logoutHandeler = () => {
    dispatch(logout());
    //navigate("/auth", { replace: true });
  };
  //user profile navigate
  const userProfileHandeler = () => {
    navigate("/profile/user", { replace: false });
  };
  // create comapny navigate
  const createComapnyNavigator = () => {
    navigate("/create-company", { replace: false });
  };

  const homeBtnActive = location.pathname === "/invoice" ? classes.active : "";
  const profileBtnActive = location.pathname.includes("profile")
    ? classes.active
    : "";
  const createCompantBtnActive =
    location.pathname === "/create-company" ? classes.active : "";

  return (
    <Fragment>
      <header className={classes.header}>
        {/* <div className={classes.icon}>
        <FaFileInvoiceDollar />
      </div> */}
        {isAuth && (
          <nav className={classes.nav}>
            <ul>
              <li className={homeBtnActive}>
                <button onClick={homeDirectHandeler}>
                  <div className={classes.tooltip}>
                    <HomeIcon />
                    <span className={classes.tooltiptext}>Home</span>
                  </div>
                </button>
              </li>
              <li className={profileBtnActive}>
                <button onClick={userProfileHandeler}>
                  <div className={classes.tooltip}>
                    <UserIcon />
                    <span className={classes.tooltiptext}>Profile </span>
                  </div>
                </button>
              </li>
              <li className={createCompantBtnActive}>
                <button onClick={createComapnyNavigator}>
                  <div className={classes.tooltip}>
                    <CaseIcon />
                    <span className={classes.tooltiptext}>Create Company </span>
                  </div>
                </button>
              </li>
              <li>
                <button onClick={logoutHandeler}>
                  <div className={classes.tooltip}>
                    <LogoutIcon />
                    <span className={classes.tooltiptext}>Logout</span>
                  </div>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </Fragment>
  );
};
export default Header;
