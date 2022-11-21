import classes from "./Pagination.module.css";
const Pagination = ({ itemsPerPage, data, paginate }) => {
  let pageNums = [];

  for (let i = 1; i <= Math.ceil(12 / itemsPerPage); i++) {
    pageNums.push(i);
  }
  return (
    <div className={classes.pagination}>
      <ul>
        {pageNums.map((number) => (
          <li key={number} onClick={() => paginate(number)}>
            {number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;
