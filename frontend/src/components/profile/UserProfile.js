import { useEffect, useContext, useState } from "react";
import { invoiceAction } from "../../store/actions";
import { useSelector, useDispatch } from "react-redux/es/exports";
import classes from "./UserProfile.module.css";
import AuthContext from "../../context/auth-context";

//start comonent
const UserProfile = () => {
  const [userData, setUserData] = useState([
    { username: "", first_name: "", last_name: "", email: "" },
  ]);
  const dispatch = useDispatch();
  const authContext = useContext(AuthContext);

  const { logout } = authContext;
  useEffect(() => {
    let token;
    if (localStorage.getItem("token")) {
      token = localStorage.getItem("token");
    }
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
        logout();
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
  }, [dispatch, logout, setUserData]);
  console.log("fetched");
  const userInfo = useSelector((state) => state.action.userInfo);
  return (
    <div className={classes["profile-content"]}>
      <div>
        <div className={classes.info}>
          <h3> Personal details</h3>

          <div>
            <div>
              <h4>E-mail</h4>
              <span>{userInfo === null ? userData.email : userInfo.email}</span>
            </div>
            <div>
              <h4>User Name</h4>
              <span>
                {userInfo === null ? userData.username : userInfo.username}
              </span>
            </div>
            <div>
              <h4>First Name</h4>
              <span>
                {userInfo === null ? userData.first_name : userInfo.first_name}
              </span>
            </div>
            <div>
              <h4>Last Name</h4>
              <span>
                {" "}
                {userInfo === null
                  ? userData.last_name
                  : userInfo.last_name}{" "}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
