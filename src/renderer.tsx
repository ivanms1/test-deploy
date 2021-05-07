import React from "react";
import ReactDOM from "react-dom";
import { QueryClientProvider } from "react-query";
import { HashRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import App from "./App";
import { AppProvider } from "./components/AppContext";
import Layout from "./components/Layout";

import { queryClient } from "./react-query/config";

import styles from "./renderer.module.scss";

import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Router>
      <AppProvider>
        <Layout>
          <App />
          <ToastContainer limit={1} bodyClassName={styles.ToastBody} />
        </Layout>
      </AppProvider>
    </Router>
  </QueryClientProvider>,
  document.getElementById("app")
);
