import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TodoInput from "./TodoInput";
import Button from "./Button";
import { Todo, Comments } from "../types";

interface TodoItemProps {
  todo: Todo;
  comment: Comments;
  fetchTodos: () => void;
  fetchComments: () => void;
}

const apiUrl = "http://localhost:3004/posts";
const apiUrlComments = "http://localhost:3004/comments";

async function editTask(taskId: string, taskCompleted: boolean): Promise<void> {
  const updatedTask = {
    completed: !taskCompleted, // Toggle the state
  };
  try {
    const response = await fetch(`${apiUrl}/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) {
      throw new Error("Failed to add task");
    }
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
}

async function deleteTask(
  taskId: string,
  taskCommented: boolean,
  commentId: string
): Promise<void> {
  try {
    const response = await fetch(`${apiUrl}/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to add task");
    }
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
  if (taskCommented) {
    try {
      const response = await fetch(`${apiUrlComments}/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  }
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo: initialTodo,
  comment,
  fetchTodos,
  fetchComments,
}) => {
  const [todo, setTodo] = useState<Todo | null>(initialTodo); // Local state for todo
  const [edit, setEdit] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<boolean>(false);

  const handleEditTask = () => {
    setEdit(true);
  };

  const handleEditCommentTask = () => {
    setEdit(true);
    setEditComment(true);
  };

  useEffect(() => {
    setTodo(initialTodo); // Update todo when initialTodo changes
  }, [initialTodo]);

  const handleToggleCompletion = async () => {
    if (todo) {
      try {
        await editTask(todo.id, todo.completed);
        // Fetch the updated todo from the server
        const response = await fetch(`${apiUrl}/${todo.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch updated task");
        }
        const updatedTodo = await response.json();
        setTodo(updatedTodo);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDeleteTodo = async () => {
    try {
      if (todo) {
        await deleteTask(todo.id, todo.commented, comment.id);
        setTodo(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return todo ? (
    <li
      className="listItem"
      key={todo.id}
      style={{
        textDecoration: todo.completed ? "line-through 2px solid red" : "none",
      }}
    >
      {edit ? (
        <TodoInput
          fetchTodos={fetchTodos}
          edit={edit}
          todo={todo}
          setEdit={setEdit}
          editComment={editComment}
          comment={comment}
          setEditComment={setEditComment}
          fetchComments={fetchComments}
        />
      ) : (
        <>
          <div className="listItem__task">
            <Link to={`/view/${todo.id}`}>
              <h3 className="listItem__task__title">{todo.title}</h3>
            </Link>
            <p className="listItem__task__content">{todo.content}</p>
            {todo.commented && (
              <p className="listItem__task__comment">
                Comment: {comment.comment}
              </p>
            )}
          </div>
          <div className="listItem__options">
            <Button
              type="options"
              label={todo.completed ? "Incomplete" : "Complete"}
              onClick={handleToggleCompletion}
              className="button--complete"
            />
            <Button
              type="options"
              label="Delete"
              onClick={handleDeleteTodo}
              className="button--delete"
            />
            <Button
              type="options"
              label="Edit Task"
              onClick={handleEditTask}
              className={todo.completed ? "button--disabled" : ""}
              disabled={todo.completed}
            />
            <Button
              type="options"
              label={todo.commented ? "Edit Comment" : "Add Comment"}
              onClick={handleEditCommentTask}
              className={todo.completed ? "button--disabled" : ""}
              disabled={todo.completed}
            />
          </div>
        </>
      )}
    </li>
  ) : null; // Render nothing if the todo is null
};

export default TodoItem;
