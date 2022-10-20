import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./Header.module.css";
import AuthContext from "../../context/auth-context";
import { FaFileInvoiceDollar } from "react-icons/fa";
import CaseIcon from "../icons/CaseIcon";
import HomeIcon from "../icons/HomeIcon";
import UserIcon from "../icons/UserIcon";
import LogoutIcon from "../icons/LogoutIcon";
const Header = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const { isLoggedIn, logout } = authCtx;

  const homeDirectHandeler = () => {
    navigate("/invoice");
  };
  const logoutHandeler = () => {
    logout();
    //navigate("/auth", { replace: true });
  };
  //user profile navigate
  const userProfileHandeler = () => {
    navigate("/profile", { replace: false });
  };
  // create comapny navigate
  const createComapnyNavigator = () => {
    navigate("/create-company", { replace: false });
  };
  return (
    <header className={classes.header}>
      <div className={classes.icon}>
        <FaFileInvoiceDollar />
      </div>
      {isLoggedIn && (
        <nav className={classes.nav}>
          <ul>
            <li>
              <button onClick={homeDirectHandeler}>
                <div className={classes.tooltip}>
                  <HomeIcon />
                  <span className={classes.tooltiptext}>Home</span>
                </div>
              </button>
            </li>
            <li>
              <button onClick={userProfileHandeler}>
                <div className={classes.tooltip}>
                  <UserIcon />
                  <span className={classes.tooltiptext}>Profile </span>
                </div>
              </button>
            </li>
            <li>
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
  );
};
export default Header;
