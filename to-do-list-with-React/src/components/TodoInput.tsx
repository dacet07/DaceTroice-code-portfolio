import React, { useState, useEffect } from "react";
import Button from "./Button";
import { Todo, Comments } from "../types";

const apiUrl = "http://localhost:3004/posts";
const apiUrlComments = "http://localhost:3004/comments";

interface TodoInputProps {
  todo?: Todo;
  fetchTodos: () => void;
  fetchComments?: () => void;
  edit: boolean;
  setEdit?: (edit: boolean) => void;
  editComment: boolean;
  setEditComment?: (editComment: boolean) => void;
  comment?: Comments;
}

const TodoInput: React.FC<TodoInputProps> = ({
  fetchTodos,
  fetchComments,
  edit,
  todo,
  setEdit,
  editComment,
  setEditComment,
  comment,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (edit && todo) {
      setTitle(todo.title);
      setContent(todo.content);
    } else {
      setTitle("");
      setContent("");
    }

    if (editComment && comment) {
      setContent(comment.comment);
    } else {
      if (!edit) setContent("");
    }
  }, [edit, editComment, todo, comment]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    const task = {
      title,
      content,
      completed: false,
      commented: false,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      fetchTodos(); //update list
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo || !fetchComments) {
      return;
    }

    const updatedTask = {
      commented: true,
    };

    fetch(`${apiUrl}/${todo.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    const task = {
      taskId: todo.id,
      comment: content,
    };

    try {
      const response = await fetch(apiUrlComments, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      fetchTodos();
      fetchComments();
      if (setEdit) setEdit(false);
      if (setEditComment) setEditComment(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo) return;

    try {
      const response = await fetch(`${apiUrl}/${todo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit task");
      }

      fetchTodos();
      if (setEdit) setEdit(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || !fetchComments) return;

    const task = {
      comment: content,
    };

    try {
      const response = await fetch(`${apiUrlComments}/${comment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error("Failed to edit task");
      }

      fetchComments();
      if (setEdit) setEdit(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || !todo || !fetchComments) return;

    try {
      const response = await fetch(`${apiUrlComments}/${comment.id}`, {
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
    const task = {
      commented: false,
    };
    try {
      const response = await fetch(`${apiUrl}/${todo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      fetchComments();
      fetchTodos();
      if (setEdit) setEdit(false);
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  };

  const handleClearInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setTitle("");
    setContent("");
    if (setEdit) setEdit(false);
    if (setEditComment) setEditComment(false);
  };

  return (
    <form
      className={`input__form ${!edit && !editComment ? "input--add" : ""}`}
      onSubmit={(e) => e.preventDefault()}
    >
      <div>
        {!editComment ? ( //if add or edit task
          <input
            className="input__title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
        ) : (
          // if add or edit comment
          <p>{todo && todo.commented ? "Edit Comment" : "Add Comment"}</p>
        )}

        <textarea
          className="input__content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
      </div>
      <div>
        {!edit && !editComment ? ( // if add task
          <Button type="input" label="Add to-do" onClick={handleAddTodo} />
        ) : (
          // if
          <Button
            type="input"
            label={
              editComment && todo && !todo.commented
                ? "Add comment"
                : "Save changes"
            }
            onClick={
              !editComment
                ? handleEditTodo
                : todo && todo.commented
                ? handleEditComment
                : handleAddComment
            }
          />
        )}
        {!edit && !editComment ? (
          <Button type="input" label="Clear" onClick={handleClearInput} />
        ) : (
          <Button type="input" label="Cancel" onClick={handleClearInput} />
        )}
        {editComment && todo && todo.commented && (
          <Button type="input" label="Delete" onClick={handleDeleteComment} />
        )}
      </div>
    </form>
  );
};

export default TodoInput;
