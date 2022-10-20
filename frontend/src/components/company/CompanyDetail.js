import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { uiActions } from "../../store/Ui-slice";
import EditIcon from "../icons/EditIcon";
import classes from "./CompanyDetail.module.css";
import EditComapnyInfo from "./EditCompanyInfo";
const CompanyDetail = ({ companies, backHandler, submitEditedCompany }) => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const editCompany = useSelector((state) => state.ui.editCompany);

  const selectedCompany = companies.find(
    (el) => el.id === parseInt(params.companyId)
  );
  const editCompanyPath = () => {
    navigate(`/profile/${selectedCompany.id}/${selectedCompany.slug}`);
  };

  let owner = `${selectedCompany.owner.first_name}  ${selectedCompany.owner.last_name}`;
  return (
    <section className={classes.company}>
      <h1> {selectedCompany.name} </h1>

      <div className={classes.detail}>
        <strong> owner : </strong>
        <span>{owner}</span>
      </div>

      <div className={classes.detail}>
        <strong> Username : </strong>
        <span> {selectedCompany.owner.username} </span>
      </div>
      <div className={classes.detail}>
        <strong> Email : </strong>
        <span>{selectedCompany.email}</span>
      </div>

      <div className={classes.detail}>
        <strong> Phone Number : </strong>
        <span>{selectedCompany.number}</span>
      </div>

      <div className={classes.detail}>
        <strong> About : </strong>
        <span> {selectedCompany.about} </span>
      </div>
      <div className={classes.detail}>
        <strong> Address : </strong>
        <span> {selectedCompany.address} </span>
      </div>

      <div className={classes.actions}>
        <button onClick={backHandler}> back </button>
        <button onClick={editCompanyPath} className={classes.edit}>
          <EditIcon /> Edit Company
        </button>
      </div>

      <Routes>
        <Route
          element={
            <EditComapnyInfo
              companies={selectedCompany}
              submitEditedCompany={submitEditedCompany}
              editCompany={editCompany}
            />
          }
          path={`/:com`}
        />
      </Routes>
    </section>
  );
};

export default CompanyDetail;
