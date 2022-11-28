import { useDispatch } from "react-redux";
import { searchData } from "../../store/search-slice";
import Inputs from "./Inputs";

import classes from "./Search.module.css";
const Search = ({ search, setSearch }) => {
  const dispatch = useDispatch();
  const searchHandler = (e) => {
    setSearch(e.target.value);
    let token = localStorage.getItem("token");
    const obj = {
      name: search,
      token,
    };

    if (e.key !== "" || e.target.value.trim("") !== "") {
      const timer = setTimeout(() => {
        dispatch(searchData(obj));
      }, 1500);

      return () => clearTimeout(timer);
    }
  };
  const submitHandler = (e) => e.preventDefault();
  return (
    <form onSubmit={submitHandler}>
      <Inputs
        className={classes.search}
        type="text"
        value={search}
        onChange={searchHandler}
        placeholder="Search (Client Name - Invoice Code - Client Email - Status - Company Name)"
      />
    </form>
  );
};

export default Search;
