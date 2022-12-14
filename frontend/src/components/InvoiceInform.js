import { Fragment, useState, useEffect } from "react";
import { useParams, Link, useNavigate, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineLeft } from "react-icons/ai";

import classes from "./InvoiceInform.module.css";

import EditInvoice from "./edit-invoice/EditInvoice";
import InformHeader from "./InformHeader";
import LoadingSpinner from "./UI/LoadingSpinner";
import { getInformation } from "../store/invoice-information";

const InoviceInform = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { invoiceId } = params;

  const invoiceDetail = useSelector(
      (state) => state.invoiceInformationRed.invoice
    ),
    isLoading = useSelector((state) => state.invoiceInformationRed.isLoading);

  //fetch invoice detail
  useEffect(() => {
    let token = localStorage.getItem("token");
    const obj = {
      token: token,
      id: invoiceId,
    };
    dispatch(getInformation(obj));
  }, [dispatch, invoiceId]);

  //previous page
  const previousHandler = () => {
    navigate(-1);
  };

  if (!invoiceDetail && isLoading) {
    return <LoadingSpinner />;
  }
  if (!invoiceDetail && !isLoading) {
    return <p className={classes.not_found}> No Invoice Found </p>;
  }

  return (
    <Fragment>
      {invoiceDetail && (
        <EditInvoice
          id={invoiceDetail.invoice_code}
          editingInovoice={invoiceDetail}
        />
      )}
      <button className={classes.icon} onClick={previousHandler}>
        <AiOutlineLeft /> <span>Go Back</span>
      </button>

      <>
        <InformHeader
          isPending={invoiceDetail.status}
          invoiceItem={invoiceDetail}
          id={invoiceDetail.invoice_code}
        />
        <div className={classes.details}>
          {/* invoice Code */}

          <p className={classes.code}>
            Invoice Code_
            <span>#</span>
            {invoiceDetail.invoice_code}
          </p>
          {/* invoice Date */}
          <div className={classes.mid}>
            <div className={classes.date}>
              <h4>Invoice Date</h4>
              <p>{invoiceDetail.created_at}</p>

              <h4>Payment Date</h4>
              <p>{invoiceDetail.get_due_date_formatted}</p>
            </div>
            {/*Bill To */}
            <div className={classes.billTo}>
              <h4>Bill To</h4>
              <p>
                <span className={classes.title}>Name : </span>{" "}
                {invoiceDetail.client_name}{" "}
              </p>

              <p>
                <span className={classes.title}>E-mail : </span>
                {invoiceDetail.client_email}
              </p>
              <p>
                {" "}
                <span className={classes.title}>Address : </span>
                {invoiceDetail.client_address}{" "}
              </p>
              <p>
                {" "}
                <span className={classes.title}>ZIP-Code : </span>
                {invoiceDetail.client_zipcode}
              </p>
              <p>
                {" "}
                <span className={classes.title}>Country : </span>
                {invoiceDetail.client_country}
              </p>
            </div>
            {/*Company Detail */}
            {invoiceDetail && invoiceDetail.company && (
              <div className={classes.company}>
                <div className={classes.avatar}>
                  <img
                    src={invoiceDetail.company.avatar}
                    alt={invoiceDetail.company.name}
                  />
                </div>
                <h3> {invoiceDetail.company.name}</h3>
              </div>
            )}
          </div>
          <div>
            <h3>Description</h3>
            <p> {invoiceDetail.description} </p>
          </div>
          <div className={classes.bot}>
            <div>
              <div>
                <ul>
                  <li>Item Name</li>
                  <li>QTY</li>
                  <li>Price</li>
                  <li>Total</li>
                </ul>
              </div>
              <div>
                {invoiceDetail.items &&
                  invoiceDetail.items.map((item) => {
                    return (
                      <ul key={item.id}>
                        <li> {item.title} </li>
                        <li> {item.quantity} </li>
                        <li> {item.unit_price} </li>
                        <li> {+item.quantity * +item.unit_price} </li>
                      </ul>
                    );
                  })}
              </div>
            </div>
            <div className={classes.amount}>
              <p>Amount Due</p>
              <p>
                $
                {invoiceDetail.items &&
                  invoiceDetail.items
                    .map((el) => +el.quantity * +el.unit_price)
                    .reduce((curr, i) => curr + i)}
              </p>
            </div>
          </div>
        </div>
      </>
    </Fragment>
  );
};
export default InoviceInform;
