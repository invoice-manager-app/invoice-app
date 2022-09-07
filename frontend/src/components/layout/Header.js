import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { AiOutlineHome, AiOutlineLogout } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import classes from "./Header.module.css";
import AuthContext from "../../context/auth-context";
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
  const userProfileHandeler = () => {
    navigate("/profile", { replace: false });
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
                  <AiOutlineHome />
                  <span className={classes.tooltiptext}>Home</span>
                </div>
              </button>
            </li>
            <li>
              <button onClick={userProfileHandeler}>
                <div className={classes.tooltip}>
                  <BiUser />
                  <span className={classes.tooltiptext}>Profile </span>
                </div>
              </button>
            </li>
            <li>
              <button onClick={logoutHandeler}>
                <div className={classes.tooltip}>
                  <AiOutlineLogout />
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
