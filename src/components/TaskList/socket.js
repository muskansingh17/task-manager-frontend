import { io } from "socket.io-client";
import { fetchTasks } from "../../slices/task.slice";

let socket = null;

export const connectSocket = (user, dispatch) => {
  socket = io(process.env.REACT_APP_API_BASE_URL);

  socket.on("connect", () => {
    console.log("Connected to WebSocket");
    socket.emit("join", user._id);
  });

  socket.on("task", async (message) => {
    console.log("Received task update via WebSocket", message);
    dispatch(fetchTasks());
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
