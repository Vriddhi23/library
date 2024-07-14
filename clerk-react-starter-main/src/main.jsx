import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Layout from "./components/Layout";
import NoMatch from "./components/NoMatch";
import AddBook from "./components/AddBook";
import DeleteBook from "./components/DeleteBook";
import Dashboard from "./components/Dashboard";
import "./styles/index.css";
import UserHome from "./UserHome";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={publishableKey}>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route path="/userhome" element={<UserHome/>}></Route>
            <Route path="/addbook" element={<AddBook/>}></Route>
            <Route path="/deletebook" element={<DeleteBook />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
          </Route>
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
