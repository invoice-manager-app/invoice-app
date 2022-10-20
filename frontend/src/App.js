import { useState, useEffect, useContext } from "react";
import Form from "./components/Form";
import Header from "./components/layout/Header";
import Wrapper from "./components/UI/Wrapper";
import Layout from "./components/layout/Layout";
import AllPages from "./pages/AllPages";
import AuthContext from "./context/auth-context";

function App() {
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );
  const authCtx = useContext(AuthContext);

  const { isLoggedIn } = authCtx;

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
            {isLoggedIn && <Header />}
            <AllPages />
          </Layout>
        </Wrapper>
      )}
    </div>
  );
}

export default App;
