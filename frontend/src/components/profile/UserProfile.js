import { useSelector } from "react-redux/es/exports";
import classes from "./UserProfile.module.css";

//start comonent
const UserProfile = ({ userData }) => {
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
