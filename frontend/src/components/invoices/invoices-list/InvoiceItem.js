import { useState } from "react";
import { Link } from "react-router-dom";
import classes from "./InvoiceItem.module.css";
import { AiOutlineRight } from "react-icons/ai";
import ShowMoreIcon from "../../icons/ShowMoreIcon";
import ShowLessIcon from "../../icons/ShowLessIcon";

const InvoiceItem = ({ items, status, name, date, id, net_amount }) => {
  const [showItems, setShowItems] = useState(false);

  const toggleItemHandeler = () => {
    setShowItems((prevState) => !prevState);
  };
  //loading state
  return (
    <div className={classes.bar}>
      <ul>
        <li> #{id.substring(0, 6)} </li>
        <li> {date} </li>
        <li> {name} </li>
        <li>${net_amount} </li>
        <li>
          <div className={status === "pending" ? "status" : "status paid"}>
            <span> {status === "pending" ? "Pending" : "Paid"} </span>
          </div>
        </li>
        <li>
          <button
            className={`${classes.button} ${showItems ? classes.active : ""}`}
            onClick={toggleItemHandeler}
          >
            {showItems ? <ShowLessIcon /> : <ShowMoreIcon />}
          </button>
        </li>
        <li>
          {" "}
          <Link to={`/invoice/${id}`} className={classes.link}>
            <AiOutlineRight />
          </Link>
        </li>
      </ul>

      {showItems && (
        <div className={classes.detail}>
          <ul className={classes.categories}>
            <li>Item Name</li>
            <li>Cost</li>
            <li>Qty</li>
            <li>Total</li>
          </ul>
          <div>
            {items.map((el, i) => {
              return (
                <ul key={i} className={classes.item}>
                  <li> {el.title} </li>
                  <li> {el.unit_price} </li>
                  <li> {el.quantity} </li>
                  <li> ${el.net_amount} </li>
                </ul>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceItem;
