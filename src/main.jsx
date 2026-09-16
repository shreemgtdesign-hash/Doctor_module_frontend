import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        containerStyle={{
          top: 80,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 5000,
        }}
      />
    </BrowserRouter>
  </Provider>
);