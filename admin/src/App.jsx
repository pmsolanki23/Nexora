import React, {
  useEffect,
  useState,
} from "react";

import Navbar from "./components/Navbar";

import Sidebar from "./components/Sidebar";

import {
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Add from "./pages/Add";

import List from "./pages/List";

import Edit from "./pages/Edit";

import ErrorBoundary from "./components/ErrorBoundary";

import Login from "./components/Login";

import { ToastContainer } from "react-toastify";

import Dashboard from "./pages/Dashboard";

import Orders from "./pages/Orders";

// eslint-disable-next-line react-refresh/only-export-components

export const backendurl =
  import.meta.env
    .VITE_BACKEND_URL;

export const currency = "$";

const App = () => {
  const [token, settoken] =
    useState(
      localStorage.getItem(
        "token"
      ) || ""
    );

  useEffect(() => {
    localStorage.setItem(
      "token",
      token
    );
  }, [token]);

  if (token === "") {
    return (
      <div className="min-h-screen bg-[#070a0f]">
        <ToastContainer />

        <Login
          settoken={settoken}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100">
      <ToastContainer />

      <Navbar
        settoken={settoken}
      />

      <div className="flex w-full">
        <Sidebar />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

            <Route
              path="/dashboard"
              element={
                <ErrorBoundary>
                  <Dashboard
                    token={
                      token
                    }
                  />
                </ErrorBoundary>
              }
            />

            <Route
              path="/add"
              element={
                <ErrorBoundary>
                  <Add
                    token={
                      token
                    }
                  />
                </ErrorBoundary>
              }
            />

            <Route
              path="/list"
              element={
                <ErrorBoundary>
                  <List
                    token={
                      token
                    }
                  />
                </ErrorBoundary>
              }
            />

            {/* ========================= */}
            {/* EDIT PRODUCT */}
            {/* ========================= */}

            <Route
              path="/edit/:id"
              element={
                <ErrorBoundary>
                  <Edit
                    token={
                      token
                    }
                  />
                </ErrorBoundary>
              }
            />

            <Route
              path="/order"
              element={
                <ErrorBoundary>
                  <Orders
                    token={
                      token
                    }
                  />
                </ErrorBoundary>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;