import { useDispatch, useSelector } from "react-redux";
import { filterInvoice } from "../../store/filter-slice";
import classes from "./FilterInvoice.module.css";
const FilterInvoices = ({ selectInput, setSelectInput }) => {
  // const dispatch = useDispatch();
  // let token = localStorage.getItem("token");
  //select handler
  const selectHandeler = (e) => {
    setSelectInput(e.target.value);

    // const obj = {
    //   token,
    //   filter: e.target.value,
    // };
    // dispatch(filterInvoice(obj));
  };

  return (
    <div className={classes.filter}>
      <label htmlFor="filter">filter by</label>
      <select id="filter" onChange={selectHandeler} value={selectInput}>
        <option value="-created_at">Newest</option>
        <option value="created_at">oldest</option>
      </select>
    </div>
  );
};

export default FilterInvoices;
