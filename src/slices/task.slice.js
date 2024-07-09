// features/taskSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTasks } from "../api";
import { toast } from "react-toastify";

const initialState = {
  tasks: [
    {
      id: 1,
      title: "Sample Task",
      description: "This is a sample task",
      deadline: "2024-07-10",
      priority: "High",
      status: "Incomplete",
      tags: ["sample", "task"],
    },
  ],
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  try {
    const tasksResponse = await getTasks();
    return tasksResponse.data.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error("You are logged out");
      window.location.href = "/login";
    } else if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Something went wrong');
    }
    throw Error(error.response ? error.response.data : error.message);
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
  },
});

export const { addTask, removeTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer;
