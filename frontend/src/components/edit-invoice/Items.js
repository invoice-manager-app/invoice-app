import Input from "../UI/Inputs";
import { MdDelete } from "react-icons/md";
import classes from "./Items.module.css";
const Items = ({
  setInputFields,
  inputField,
  inputFields,
  index,
  setIsValid,
}) => {
  const handleChangeInput = (e, index) => {
    const { id, value } = e.target;
    console.log(id);

    const list = [...inputFields];
    if (!isNaN(list[index][id]) && id !== "title") {
      list[index][id] = parseInt(value);
    } else {
      list[index][id] = value.toString();
    }
    setIsValid(true);
    setInputFields(list);
  };

  //remove handler
  const removeHandeler = (index) => {
    const list = [...inputFields];
    let arr = [];
    list.map((el) => (el.delete === undefined ? arr.push(el) : ""));

    if (arr.length === 1) return;

    list[index].delete = true;

    if (list[index].delete === true) {
      setIsValid(true);
    }

    if (list[index].delete === undefined) {
    }

    setInputFields(list);
  };
  const deleteBtnDisbale = inputFields.length === 1 ? classes.disable : "";

  return (
    <div className={inputField.delete === true ? classes.deleted : ""}>
      <ul className={classes.items}>
        <li>
          <Input
            type="text"
            id="title"
            label="Item Name"
            value={inputField.title}
            onChange={(event) => handleChangeInput(event, index)}
            readOnly={inputField.delete === true ? true : false}
          />
        </li>
        <li>
          <Input
            type="number"
            id="quantity"
            label="Quantity"
            value={+inputField.quantity}
            min="1"
            onChange={(event) => handleChangeInput(event, index)}
            readOnly={inputField.delete === true ? true : false}
          />
        </li>
        <li>
          <Input
            type="number"
            id="unit_price"
            label="Price"
            min="1"
            readOnly={inputField.delete === true ? true : false}
            value={+inputField.unit_price}
            onChange={(event) => handleChangeInput(event, index)}
          />
        </li>
        <li>
          <Input
            type="number"
            id="tax_rate"
            min="0"
            max="99"
            readOnly={inputField.delete === true ? true : false}
            label="Tax"
            value={+inputField.tax_rate}
            onChange={(event) => handleChangeInput(event, index)}
          />
        </li>
        <li>
          <Input
            type="number"
            label="Total"
            value={
              +inputField.unit_price * +inputField.quantity +
              (inputField.tax_rate / 100) *
                (+inputField.unit_price * +inputField.quantity)
            }
            readOnly
          />
        </li>

        <li className={classes.deleteBtn}>
          <div className={deleteBtnDisbale}>
            <MdDelete onClick={() => removeHandeler(index)} />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Items;
