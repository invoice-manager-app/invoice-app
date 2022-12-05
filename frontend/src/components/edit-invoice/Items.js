import Input from "../UI/Inputs";
import { MdDelete } from "react-icons/md";
import classes from "./Items.module.css";
const Items = ({ setInputFields, inputField, inputFields, index }) => {
  const handleChangeInput = (e, index) => {
    const { id, value } = e.target;
    const list = [...inputFields];
    list[index][id] = parseInt(value);
    list[index]["title"] = value;

    setInputFields(list);
  };

  //remove handler
  const removeHandeler = (index) => {
    const list = [...inputFields];
    list.splice(index, 1);
    setInputFields(list);
  };

  return (
    <div>
      <ul>
        <li>
          <Input
            type="text"
            id="title"
            label="Item Name"
            value={inputField.title}
            onChange={(event) => handleChangeInput(event, index)}
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
          />
        </li>
        <li>
          <Input
            type="number"
            id="unit_price"
            label="Price"
            min="1"
            value={+inputField.unit_price}
            onChange={(event) => handleChangeInput(event, index)}
          />
        </li>
        <li>
          <Input
            type="number"
            id="tax_rate"
            min="0"
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
          <div>
            <MdDelete onClick={() => removeHandeler(index)} />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Items;
