import React from "react";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import store from "./store";
import TaskList from "./components/TaskList/TaskList";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import PrivateRoute from "./components/PrivateRoute";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <PrivateRoute>
          <Login />
        </PrivateRoute>
      ),
    },
    {
      path: "/register",
      element: (
        <PrivateRoute>
          <Register />
        </PrivateRoute>
      ),
    },
    {
      path: "/",
      element: (
        <PrivateRoute>
          <TaskList />
        </PrivateRoute>
      ),
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
};

const AppWithStore = () => (
  <>
  <ToastContainer />
  <Provider store={store}>
    <App />
  </Provider>
  </>
);

export default AppWithStore;
