import { useSelector, useDispatch } from "react-redux";
import { Pagination } from "antd";
import { getPagination } from "../../store/pagination-slice";
import { useEffect } from "react";
import { searchPagination } from "../../store/search-pagination-slice";
import { getInvoicList } from "../../store/get-invoice-slice";
import { searchData } from "../../store/search-slice";

const PaginationComponent = ({
  setCurrentPage,
  currentPage,
  count,
  itemsPerPage,
  search,
  filter,
}) => {
  const dispatch = useDispatch();

  // let pageNums = [];

  // for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
  //   pageNums.push(i);
  // }
  useEffect(() => {
    if (search.trim() !== "") {
      setCurrentPage(1);
    }
  }, [search, setCurrentPage]);
  //paginations
  const paginationHandler = (number) => {
    // store current page in session storage
    sessionStorage.setItem("current-page", number);

    let token = localStorage.getItem("token");

    const obj = {
      number: number,
      token,
      name: search,
    };

    if (search === "" && number !== 1 && filter === "") {
      delete obj.name;
      dispatch(getPagination(obj));
    }

    // if (number === 1 && search === "" && filter === "") {
    //   dispatch(getInvoicList(token));
    // }
    // if (number !== 1 && search !== "") {
    //   dispatch(searchPagination(obj));
    // }
    // if (number === 1 && search !== "") {
    //   delete obj.number;
    //   dispatch(searchData(obj));
    // }
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
