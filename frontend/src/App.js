import { useState, useEffect } from "react";
import Form from "./components/add-invoice/Form";
import Header from "./components/layout/Header";
import Wrapper from "./components/UI/Wrapper";
import Layout from "./components/layout/Layout";
import AllPages from "./pages/AllPages";
import AuthContext from "./context/auth-context";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateToken } from "./store/authSlice";

function App() {
  const { isAuth } = useSelector((state) => state.authReducer);

  window.domain = "http://localhost:8000";

  //auth
  const dispatch = useDispatch();
  const { refresh, token } = useSelector((state) => state.authReducer);

  useEffect(() => {
    if (token !== null) {
      dispatch(updateToken(refresh));
    } else {
      dispatch(logout());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      if (refresh) {
        dispatch(updateToken(refresh));
      }
    }, 57000);
    return () => clearInterval(timer);
  }, [dispatch, refresh]);

  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    const handler = (e) => setMatches(e.matches);
    window.matchMedia("(min-width: 900px)").addEventListener("change", handler);
  }, []);

  return (
    <div>
      {!matches && (
        <div className="center">
          <h1 className="warning">
            Sorry, this app is not supported on Mobile Devices!
          </h1>{" "}
        </div>
      )}

      {matches && (
        <Wrapper>
          <Layout>
            {<Form />}
            {isAuth && <Header />}
            <AllPages />
          </Layout>
        </Wrapper>
      )}
    </div>
  );
}

export default App;

// authentication with redux
//get invoices with redux
