import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Form from "./components/Form";
import Header from "./components/layout/Header";
import Wrapper from "./components/UI/Wrapper";
import Layout from "./components/layout/Layout";
import AllPages from "./pages/AllPages";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./themes";
import AuthPage from "./pages/AuthPage";
import ConfirmationModel from "./components/UI/ConfirmationModel";
function App() {
  const location = useLocation();
  const [theme, setTheme] = useState("dark");
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    const handler = (e) => setMatches(e.matches);
    window.matchMedia("(min-width: 900px)").addEventListener("change", handler);
  }, []);

  const themeChangeHandeler = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <div data-theme={theme}>
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
            <Header />
            <AllPages />
          </Layout>
        </Wrapper>
      )}
    </div>
  );
}

export default App;
