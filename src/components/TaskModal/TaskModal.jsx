import React, { useState, useEffect } from "react";
import "./TaskModal.css";

const TaskModal = ({ isOpen, onRequestClose, onSave, task, mode, userEmails }) => {
  const initialFormData = {
    title: "",
    description: "",
    deadline: "",
    priority: "low",
    status: "in_progress",
    tags: "",
    userId: "",
    permission: "viewer",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (mode === "share") {
      setFormData({
        ...initialFormData,
        userId: "",
      });
    } else if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        deadline: task.deadline.split("T")[0],
        priority: task.priority,
        status: task.status,
        tags: task.tags.join(", "),
        userId: "",
        permission: "viewer",
      });
    } else {
      setFormData(initialFormData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, task, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const taskData = {
      title: formData.title,
      description: formData.description,
      deadline: formData.deadline,
      priority: formData.priority,
      status: formData.status,
      tags: tagsArray,
    };

    if (mode === "share") {
      onSave(task._id, {
        userId: formData.userId,
        permission: formData.permission,
      });
    } else if (task) {
      onSave(task._id, taskData);
    } else {
      onSave(taskData);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="Overlay">
          <div className="Modal">
            <i
              className="fas fa-times CloseButton"
              onClick={onRequestClose}
            ></i>
            <div className="ModalBody">
              <h2>
                {mode === "share"
                  ? "Share Task"
                  : task
                  ? "Edit Task"
                  : "Create Task"}
              </h2>
              <form onSubmit={handleSubmit}>
                {mode !== "share" && (
                  <>
                    <div className="FormGroup">
                      <label htmlFor="title" className="label">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter title of task"
                      />
                    </div>
                    <div className="FormGroup">
                      <label htmlFor="description" className="label">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter description of task"
                      />
                    </div>
                    <div className="FormGroup">
                      <label htmlFor="deadline" className="label">
                        Deadline
                      </label>
                      <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="FormGroup FormGroupRow">
                      <div className="FormGroupHalf">
                        <label htmlFor="priority" className="label">
                          Priority
                        </label>
                        <select
                          id="priority"
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div className="FormGroupHalf">
                        <label htmlFor="status" className="label">
                          Status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="todo">Todo</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    </div>
                    <div className="FormGroup">
                      <label htmlFor="tags" className="label">
                        Tags
                      </label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="Enter tags for the task"
                      />
                    </div>
                  </>
                )}
                {mode === "share" && (
                  <>
                    <div className="FormGroup">
                      <label htmlFor="userId" className="label">
                        Email
                      </label>
                      <select
                        id="userId"
                        name="userId"
                        value={formData.userId}
                        onChange={handleInputChange}
                      >
                        {userEmails.map((userEmail, idx) => (
                          <option key={idx} value={userEmail._id}>
                            {userEmail.email}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="FormGroup">
                      <label htmlFor="permission" className="label">
                        Permission
                      </label>
                      <select
                        id="permission"
                        name="permission"
                        value={formData.permission}
                        onChange={handleInputChange}
                      >
                        <option value="collaborator">Edit</option>
                        <option value="viewer">View Only</option>
                      </select>
                    </div>
                  </>
                )}
                <div className="FormGroup">
                  <button type="submit" className="SaveButton">
                    {mode === "share"
                      ? "Share Task"
                      : task
                      ? "Update Task"
                      : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskModal;
