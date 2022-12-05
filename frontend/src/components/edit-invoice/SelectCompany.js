import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { token } from "../../helper/token-id";
import { getCompanies } from "../../store/company-slice";
import classes from "./SelectCompany.module.css";

const SelectCompany = ({
  responseMsg,
  setSelectedCompany,
  selectedCompany,
  companies,
}) => {
  const dispatch = useDispatch();

  //select handler change

  const selectHandleChange = (event) => {
    setSelectedCompany(event.target.value);
  };
  console.log(selectedCompany);
  //fetch companies
  useEffect(() => {
    dispatch(getCompanies(token));
  }, [dispatch]);
  let allCompanies = useSelector((state) => state.getInvoiceData.selectCompany);
  const loadingState = useSelector((state) => state.getInvoiceData.isLoading);

  return (
    <div className={classes.selectCompany}>
      <h4>Bill From</h4>
      <span className={classes.arrow}></span>
      {loadingState ? (
        <p>loading companies</p>
      ) : (
        <select
          required
          title="companies"
          aria-label="label for the select"
          onChange={selectHandleChange}
          value={selectedCompany}
        >
          <option value="select" hidden>
            --select--
          </option>
          {allCompanies &&
            allCompanies.map((company, i) => {
              return (
                <option key={i} value={`${company.name}`}>
                  {company.name}
                </option>
              );
            })}
        </select>
      )}
      {responseMsg && responseMsg.company && !isNaN(selectedCompany) && (
        <p className="response-text"> Please Select The company </p>
      )}
    </div>
  );
};

export default SelectCompany;
