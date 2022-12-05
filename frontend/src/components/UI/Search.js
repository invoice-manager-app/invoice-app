import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { searchData } from "../../store/search-slice";
import Inputs from "./Inputs";

import classes from "./Search.module.css";
const Search = ({ search, setSearch }) => {
  const dispatch = useDispatch();

  const searchHandler = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (search.trim() === "") return;
    let token = localStorage.getItem("token");
    const obj = {
      name: search,
      token,
    };

    if (search.trim() !== "") {
      const timer = setTimeout(() => {
        dispatch(searchData(obj));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [dispatch, search]);

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
