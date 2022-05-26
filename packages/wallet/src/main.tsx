import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";

import "@/index.css";
import App from "@/App";

ReactDOM.render(
    <StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </StrictMode>,
    document.getElementById("root"),
);
