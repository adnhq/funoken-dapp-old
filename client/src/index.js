import React from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import reportWebVitals from "./reportWebVitals";
import "./index.css";

const appId = "1EPNVdB5QnJFQCZ8iMh7uAysCLW3pLMfudCvBRAt";
const serverUrl = "https://s5iuritfagi0.usemoralis.com:2053/server";
ReactDOM.render(
    <React.StrictMode>
        <MoralisProvider appId={appId} serverUrl={serverUrl}>
            <ChakraProvider>
                <Router>
                    <App />
                </Router>
            </ChakraProvider>
        </MoralisProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();
