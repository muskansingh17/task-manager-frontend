import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import TaskRow from "../TaskRow";
import TaskModal from "../TaskModal/TaskModal";
import Filter from "../Filter";
import {
  createTask,
  deleteTask,
  getUserEmails,
  shareTask,
  updateTask,
} from "../../api";
import { fetchTasks } from "../../slices/task.slice";
import { logout } from "../../slices/user.slice";
import { connectSocket, disconnectSocket } from "./socket";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { capitalize } from "../../utils";
import "./TaskList.css";

const TaskList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const tasks = useSelector((state) => state.tasks.tasks);

  const [filter, setFilter] = useState({
    search: "",
    priority: "",
    status: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalTask, setModalTask] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [isLoading, setIsLoading] = useState(false);
  const [userEmails, setUserEmails] = useState([]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleCreateTask = useCallback(
    async (newTask) => {
      try {
        setIsLoading(true);
        await createTask(newTask);
        setModalIsOpen(false);
      } catch (error) {
        if (error.response.status === 401) {
          toast.error("You are logged out");
          navigate("/login");
        } else {
          toast.error(error.response.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  const handleEditTask = useCallback(
    async (taskId, updatedTask) => {
      try {
        setIsLoading(true);
        await updateTask(taskId, updatedTask);
        setModalIsOpen(false);
      } catch (error) {
        if (error.response.status === 401) {
          toast.error("You are logged out");
          navigate("/login");
        } else {
          toast.error(error.response.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  const handleDeleteTask = useCallback(
    async (taskId) => {
      try {
        setIsLoading(true);
        await deleteTask(taskId);
      } catch (error) {
        if (error.response.status === 401) {
          toast.error("You are logged out");
          navigate("/login");
        } else {
          toast.error(error.response.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  const handleShareTask = useCallback(
    async (taskId, sharingDetails) => {
      try {
        setIsLoading(true);
        await shareTask(taskId, sharingDetails);
        setModalIsOpen(false);
      } catch (error) {
        if (error.response.status === 401) {
          toast.error("You are logged out");
          navigate("/login");
        } else {
          toast.error(error.response.data.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  const fetchUserEmails = useCallback(async () => {
    try {
      const userEmailsResponse = await getUserEmails();
      setUserEmails(userEmailsResponse.data.data);
    } catch (error) {
      console.error("Error fetching user emails:", error);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchTasks());
    connectSocket(user, dispatch);
    return () => {
      disconnectSocket();
    };
  }, [dispatch, user]);

  const filteredTasks = tasks.filter((task) => {
    if (filter.priority && filter.priority !== task.priority) return false;
    if (filter.status && filter.status !== task.status) return false;
    if (filter.search) {
      const { search } = filter;
      return (
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase()) ||
        task.tags.some((tag) =>
          tag.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    return true;
  });

  return (
    <div className="task-list">
      <header className="header">
        <div className="logo">
          <h1>Task Manager</h1>
        </div>
        <div className="logout">
          <h2>Hello {capitalize(user.name)}</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <Filter filter={filter} setFilter={setFilter} />
      <button
        className="create-task-btn"
        onClick={() => {
          setModalTask(null);
          setModalMode("view");
          setModalIsOpen(true);
        }}
      >
        Create Task
      </button>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", fontStyle: "italic" }}
                >
                  No tasks found. Add something!
                </td>
              </tr>
            ) : (
              filteredTasks.map((task, index) => (
                <TaskRow
                  key={index}
                  task={task}
                  onEdit={() => {
                    setModalTask(task);
                    setModalMode("view");
                    setModalIsOpen(true);
                  }}
                  onDelete={() => handleDeleteTask(task._id)}
                  onShare={async () => {
                    await fetchUserEmails();
                    setModalTask(task);
                    setModalMode("share");
                    setModalIsOpen(true);
                  }}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <TaskModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        onSave={
          modalMode === "view"
            ? modalTask
              ? handleEditTask
              : handleCreateTask
            : handleShareTask
        }
        task={modalTask}
        mode={modalMode}
        userEmails={userEmails}
      />
      {isLoading && <div className="loading-overlay">Processing...</div>}
    </div>
  );
};

export default TaskList;
