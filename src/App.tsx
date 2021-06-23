import { AnimatePresence } from "framer-motion";
import React, { lazy, Suspense } from "react";
import { Route, Switch, useLocation } from "react-router";

import Spinner from "./components/Spinner";

const FileDetails = lazy(() => import("./pages/FileDetails"));
const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const FileUpload = lazy(() => import("./pages/FileUpload"));
const UserDetails = lazy(() => import("./pages/UserDetails"));
const Uploads = lazy(() => import("./pages/UserFiles/Uploads"));
const Downloads = lazy(() => import("./pages/UserFiles/Downloads"));
const Category = lazy(() => import("./pages/Category"));

function App() {
  const location = useLocation();
  return (
    <Suspense fallback={<Spinner />}>
      <AnimatePresence exitBeforeEnter initial={false}>
        <Switch location={location} key={location.pathname}>
          <Route path="/file/:id">
            <FileDetails />
          </Route>
          <Route path="/file-upload">
            <FileUpload />
          </Route>
          <Route path="/user-details">
            <UserDetails />
          </Route>
          <Route path="/user-uploads/:id">
            <Uploads />
          </Route>
          <Route path="/user-downloads/">
            <Downloads />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          <Route path="/category/:id">
            <Category />
          </Route>
          <Route path="/" exact>
            <Home />
          </Route>
        </Switch>
      </AnimatePresence>
    </Suspense>
  );
}

export default App;
