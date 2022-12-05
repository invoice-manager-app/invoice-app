import { useSelector, useDispatch } from "react-redux";
import { Pagination } from "antd";
import { getPagination } from "../../store/pagination-slice";
import { useEffect } from "react";

const PaginationComponent = ({
  setCurrentPage,
  currentPage,
  count,
  itemsPerPage,
  search,
}) => {
  const dispatch = useDispatch();
  const next = useSelector((state) => state.paginationReducer.next);
  const previous = useSelector((state) => state.paginationReducer.previous);
  let pageNums = [];

  for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
    pageNums.push(i);
  }
  useEffect(() => {
    if (search.trim() !== "") {
      setCurrentPage(1);
    }
  }, [search, setCurrentPage]);

  //paginations
  const paginationHandler = (number) => {
    let token = localStorage.getItem("token");

    if (number !== 1) {
      const obj = {
        num: number,
        token,
      };

      dispatch(getPagination(obj));
    }
    setCurrentPage(number);
  };

  //

  return (
    <Pagination
      onChange={(value) => paginationHandler(value)}
      pageSize={itemsPerPage}
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
