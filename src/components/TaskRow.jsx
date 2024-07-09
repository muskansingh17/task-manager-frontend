import React from "react";
import { capitalize } from "../utils";

const TaskRow = ({ task, onEdit, onDelete, onShare }) => {
  const handleShareClick = () => {
    onShare(task);
  };

  // Determine if the current user can perform actions based on task permission
  const canEdit =
    task.permission === "owner" || task.permission === "collaborator";
  const canDelete = task.permission === "owner";
  const canShare = task.permission === "owner";

  return (
    <tr>
      <td>{task.title}</td>
      <td>{task.description}</td>
      <td>{task.deadline.split('T')[0]}</td>
      <td>{capitalize(task.priority)}</td>
      <td>{capitalize(task.status)}</td>
      <td>{task.tags.join(", ")}</td>
      <td className="action-buttons">
        <i
          className={`fas fa-edit ${canEdit ? "" : "disabled"}`}
          style={{ color: canEdit ? "" : "gray" }}
          onClick={canEdit ? onEdit : undefined}
        ></i>
        <i
          className={`fas fa-trash-alt ${canDelete ? "" : "disabled"}`}
          style={{ color: canDelete ? "" : "gray" }}
          onClick={canDelete ? onDelete : undefined}
        ></i>
        <i
          className={`fas fa-share-alt ${canShare ? "" : "disabled"}`}
          style={{ color: canShare ? "" : "gray" }}
          onClick={canShare ? handleShareClick : undefined}
        ></i>
      </td>
    </tr>
  );
};

export default TaskRow;
