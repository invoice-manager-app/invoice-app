import { useEffect, useState } from "react";
import { invoiceAction } from "../../store/actions";
import { useSelector, useDispatch } from "react-redux/es/exports";
import classes from "./UserProfile.module.css";
import { logout } from "../../store/authSlice";

//start comonent
const UserProfile = () => {
  let { token } = useSelector((state) => state.authReducer);

  const [userData, setUserData] = useState([
    { username: "", first_name: "", last_name: "", email: "" },
  ]);
  const dispatch = useDispatch();

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
        dispatch(logout());
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
  }, [dispatch, setUserData]);
  console.log("fetched");
  const userInfo = useSelector((state) => state.action.userInfo);
  return (
    <div className={classes["profile-content"]}>
      <div>
        <div className={classes.info}>
          <h3> Personal details</h3>

          <div>
            <div>
              <h4>
                E-mail :{" "}
                <span>
                  {userInfo === null ? userData.email : userInfo.email}
                </span>{" "}
              </h4>
            </div>
            <div>
              <h4>
                User Name :{" "}
                <span>
                  {userInfo === null ? userData.username : userInfo.username}
                </span>
              </h4>
            </div>
            <div>
              <h4>
                First Name :{" "}
                <span>
                  {userInfo === null
                    ? userData.first_name
                    : userInfo.first_name}
                </span>
              </h4>
            </div>
            <div>
              <h4>
                Last Name :{" "}
                <span>
                  {" "}
                  {userInfo === null
                    ? userData.last_name
                    : userInfo.last_name}{" "}
                </span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
