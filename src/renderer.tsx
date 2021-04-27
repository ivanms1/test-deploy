import React from "react";
import ReactDOM from "react-dom";
import { QueryClientProvider } from "react-query";
import { HashRouter as Router } from "react-router-dom";

import App from "./App";
import { AppProvider } from "./components/AppContext";
import Layout from "./components/Layout";

import { queryClient } from "./react-query/config";

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Router>
      <AppProvider>
        <Layout>
          <App />
        </Layout>
      </AppProvider>
    </Router>
  </QueryClientProvider>,
  document.getElementById("app")
);
