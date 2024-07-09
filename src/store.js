// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user.slice";
import taskReducer from "./slices/task.slice";

const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: taskReducer,
  }
});

export default store;
