import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { paginationActions } from "../../store/pagination-slice";
import classes from "./Pagination.module.css";
const Pagination = ({ itemsPerPage, setCurrentPage }) => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.paginationReducer.count);
  const next = useSelector((state) => state.paginationReducer.next);
  const previous = useSelector((state) => state.paginationReducer.previous);
  let pageNums = [];

  for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
    pageNums.push(i);
  }

  //paginations
  const paginationHandler = (number) => {
    dispatch(paginationActions.setCurrentPage(number));
  };

  return (
    <div className={classes.pagination}>
      <button disabled={!previous}>previous</button>

      <ul>
        {pageNums.map((number) => (
          <li key={number} onClick={() => paginationHandler(number)}>
            {number}
          </li>
        ))}
      </ul>
      <button disabled={!next}>Next</button>
    </div>
  );
};

export default Pagination;
