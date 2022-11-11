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

//add new company

// export const AddNewCompany = (token, values) => {
//   return async (dispatch) => {
//     dispatch(
//       uiActions.notification({
//         status: "pending",
//         message: "wait....",
//       })
//     );

//     //HEADER
//     const myHeaders = new Headers();
//     myHeaders.append("Authorization", `Bearer ${token}`);
//     //body
//     const formdata = new FormData();
//     formdata.append("name", values.companyName);
//     formdata.append("email", values.email);
//     formdata.append("owner", values.name);
//     formdata.append("about", values.about);
//     formdata.append("number", values.number);
//     formdata.append("address", values.address);

//     fetch("http://127.0.0.1:8000/company/", {
//       method: "POST",
//       headers: myHeaders,
//       body: formdata,
//     })
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error("Something went wrong");
//         }

//         return res.json();
//       })
//       .then((data) => {
//         dispatch(
//           uiActions.notification({
//             status: "succeed",
//             message: data.response,
//           })
//         );
//       })
//       .catch((err) => {
//         dispatch(
//           uiActions.notification({
//             status: "error",
//             message: err.message,
//           })
//         );
//       });
//   };
// };

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

    console.log(formdata.has("address"));
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
