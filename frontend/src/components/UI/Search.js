import Inputs from "./Inputs";

import classes from "./Search.module.css";
const Search = ({ search, setSearch }) => {
  const searchHandler = (e) => {
    setSearch(e.target.value);
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
