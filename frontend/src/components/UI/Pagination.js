import { useSelector, useDispatch } from "react-redux";
import { Pagination } from "antd";

import { useNavigate } from "react-router-dom";
import classes from "./Pagination.module.css";
const PaginationComponent = ({
  itemsPerPage,
  setCurrentPage,
  currentPage,
  count,
}) => {
  const dispatch = useDispatch();
  const next = useSelector((state) => state.paginationReducer.next);
  const previous = useSelector((state) => state.paginationReducer.previous);
  let pageNums = [];

  for (let i = 1; i <= Math.ceil(count / 2); i++) {
    pageNums.push(i);
  }

  //paginations
  const paginationHandler = (number) => {
    // dispatch(paginationActions.setCurrentPage(number));
    setCurrentPage(number);
  };

  //

  return (
    <Pagination
      onChange={(value) => setCurrentPage(value)}
<<<<<<< HEAD
      pageSize={itemsPerPage}
=======
      pageSize={2}
>>>>>>> 962b1cf (fix get_gross_amount for the invoices)
      total={count}
      current={currentPage}
    />
  );
  // <div className={classes.pagination}>
  //   <button
  //     disabled={!previous}
  //     onClick={() => setCurrentPage((prevNum) => prevNum - 1)}
  //   >
  //     previous
  //   </button>

  //   <ul>
  //     {pageNums.map((number) => (
  //       <li key={number} onClick={() => paginationHandler(number)}>
  //         {number}
  //       </li>
  //     ))}
  //   </ul>
  //   <button
  //     disabled={!next}
  //     onClick={() => setCurrentPage((prevNum) => prevNum + 1)}
  //   >
  //     Next
  //   </button>
  // </div>
};

export default PaginationComponent;
