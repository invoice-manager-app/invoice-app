import { QueryClient, QueryClientProvider } from "react-query";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/index";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/auth-context";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <AuthContextProvider>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </AuthContextProvider>
  </QueryClientProvider>
);
