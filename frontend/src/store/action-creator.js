import { uiActions } from "./Ui-slice";
import { invoiceAction } from "./actions";
import checkProperties from "../util/check-objects-keys";

//edit user info
export const editUserRequest = (token, values) => {
  return async (dispatch) => {
    dispatch(
      uiActions.notification({
        status: "pending",
        message: "wait....",
      })
    );
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append(
      "Cookie",
      "csrftoken=MNXUba1W6nyNSHg8BtUCmdBr06VIHL8go6E5zKXjqsVmGpEsvLwPwUWZudbsxhWm"
    );

    var formdata = new FormData();
    formdata.append("username", values.username);
    formdata.append("first_name", values.first_name);
    formdata.append("last_name", values.last_name);
    formdata.append("email", values.email);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("http://127.0.0.1:8000/account/edit/", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("something went wrong");
        }
        return response.json();
      })
      .then((result) => {
        dispatch(
          invoiceAction.editUser({
            username: result.username,
            first_name: result.first_name,
            last_name: result.last_name,
            email: result.email,
          })
        );
        dispatch(
          uiActions.notification({
            status: "succeed",
            message: result.response,
          })
        );
        dispatch(uiActions.toggleUser());
      })
      .catch((error) => {
        dispatch(
          uiActions.notification({
            status: "error",
            message: error.message,
          })
        );
      });
  };
};

//delete company
export const deleteCompany = (token, name, email, slug) => {
  return (dispatch) => {
    dispatch(
      uiActions.notification({
        status: "pending",
        message: "wait....",
      })
    );
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("name", name);
    formdata.append("email", email);

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`http://127.0.0.1:8000/company/${slug}/`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText || "Something went wrong");
        }
        return response.json();
      })
      .then((result) => {
        dispatch(
          uiActions.notification({
            status: "succeed",
            message: result.response_message,
          })
        );
        dispatch(uiActions.switchToCompany());
      })
      .catch((error) => {
        dispatch(
          uiActions.notification({
            status: "error",
            message: error.message,
          })
        );
      });
  };
};

//edit company
export const editCompanyFn = (token, values, slug) => {
  return (dispatch) => {
    if (Object.keys(values).length === 0) {
      return;
    }

    dispatch(
      uiActions.notification({
        status: "pending",
        message: "wait....",
      })
    );

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();

    if (values.companyName) {
      formdata.append("name", values.companyName);
    }

    if (values.image) {
      formdata.append("avatar", values.image);
    }

    if (values.email) {
      formdata.append("email", values.email);
    }
    if (values.name) {
      formdata.append("owner", values.name);
    }
    if (values.about) {
      formdata.append("about", values.about);
    }
    if (values.number) {
      formdata.append("number", values.number);
    }

    if (values.address) {
      formdata.append("address", values.address);
    }

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`http://127.0.0.1:8000/company/${slug}/`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText || "Something went wrong");
        }
        return response.json();
      })
      .then((result) => {
        dispatch(uiActions.switchToCompany());

        dispatch(
          uiActions.notification({
            status: "succeed",
            message: result.response_message,
          })
        );
      })
      .catch((error) => {
        // console.log(error);
        dispatch(
          uiActions.notification({
            status: "error",
            message: error.message,
          })
        );
      });
  };
};

//create invoice

export const createInvoice = (token, selectedCompany, values, items) => {
  return async (dispatch) => {
    const createNewInvoice = async (dispatch) => {
      const response = await fetch("http://localhost:8000/invoice/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company: selectedCompany,
          client_name: values.clientName,
          client_email: values.clientMail,
          client_address: values.clientAddress,
          client_zipcode: values.clientZcode,
          client_city: values.clientCity,
          client_country: values.clientCountry,
          description: values.productionDescription,
          due_after: values.paymentDue,
          items: items,
        }),
      });
      const data = await response.json();
      console.log(data);

      return data;
    };

    try {
      const data = await createNewInvoice();

      dispatch(uiActions.respponseMsg(data));
    } catch (error) {
      console.log(error);
    }
  };
};

//delete Invoice

export const deleteInvoice = (id, token) => {
  return async (dispatch) => {
    dispatch(
      uiActions.notification({
        status: "pending",
        message: "Deleting.....",
      })
    );

    const deleteRequest = async () => {
      const response = await fetch(`http://localhost:8000/invoice/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.json();

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return data;
    };

    try {
      const data = await deleteRequest();
      dispatch(
        uiActions.notification({
          status: "succeed",
          message: data.response_message,
        })
      );
    } catch (error) {
      dispatch(
        uiActions.notification({
          status: "error",
          message: error.message,
        })
      );
    }
  };
};
