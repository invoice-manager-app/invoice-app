import { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import EditIcon from "../icons/EditIcon";
import DeleteIcon from "../icons/DeleteIcon";
import classes from "./CompanyDetail.module.css";
import EditComapnyInfo from "./EditCompanyInfo";
import ConfirmationModel from "../UI/ConfirmationModel";
import { uiActions } from "../../store/Ui-slice";
const CompanyDetail = ({
  companies,
  backHandler,
  submitEditedCompany,
  deleteCompany,
  getAllCompanies,
}) => {
  const [editForm, setEditForm] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const editCompany = useSelector((state) => state.ui.editCompany);

  //confirmation Object
  const deleteConfirmation = useSelector((state) => state.ui.deleteConfirm);

  const selectedCompany = companies.find(
    (el) => el.id === parseInt(params.companyId)
  );

  const editCompanyPath = () => {
    navigate(`/profile/${selectedCompany.id}/${selectedCompany.slug}`);
    setEditForm(true);
  };

  //delete Handler

  const showDeleteConfirmation = () => {
    dispatch(
      uiActions.showDeleteConfirm({
        message: `Delete ${selectedCompany.name} company permanently? `,
      })
    );
  };

  console.log(selectedCompany);
  let owner = `${selectedCompany.owner.first_name}  ${selectedCompany.owner.last_name}`;
  return (
    <Fragment>
      {deleteConfirmation && (
        <ConfirmationModel
          deleteCompany={deleteCompany}
          selectedCompany={selectedCompany}
          getAllCompanies={getAllCompanies}
        />
      )}

      {!editForm && (
        <section className={classes.company}>
          <h1> {selectedCompany.name} </h1>

          <div className={classes.detail}>
            <div className={classes.avatar}>
              <img src={selectedCompany.avatar} alt="avatar" />
            </div>
          </div>
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
            <button
              onClick={showDeleteConfirmation}
              className={classes.deleteBtn}
            >
              <DeleteIcon /> Delete
            </button>
          </div>
        </section>
      )}

      <Routes>
        <Route
          element={
            <EditComapnyInfo
              companies={selectedCompany}
              submitEditedCompany={submitEditedCompany}
              editCompany={editCompany}
              getAllCompanies={getAllCompanies}
            />
          }
          path={`/:com`}
        />
      </Routes>
    </Fragment>
  );
};

export default CompanyDetail;
