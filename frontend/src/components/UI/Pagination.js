import { Pagination } from "antd";

const PaginationComponent = ({
  setCurrentPage,
  currentPage,
  count,
  itemsPerPage,
}) => {
  //paginations
  const paginationHandler = (number) => {
    // store current page in session storage
    sessionStorage.setItem("current-page", number);

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
};

export default PaginationComponent;
