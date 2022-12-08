import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SelectCompany = ({ selectedCompany, setSelectedCompany }) => {
  const [companies, setCompanies] = useState([]);
  let allCompanies = useSelector((state) => state.getInvoiceData.selectCompany);

  //fetch companies
  useEffect(() => {
    setCompanies(allCompanies);
  }, [allCompanies]);

  //select handler change

  const selectHandleChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  return (
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
      {companies !== null &&
        companies.map((company, i) => {
          return (
            <option key={i} value={`${company.name}`}>
              {company.name}
            </option>
          );
        })}
    </select>
  );
};

export default SelectCompany;
