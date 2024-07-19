import React from "react";
import TodoItem from "./TodoItem";
import { Todo, Comments } from "../types";

interface TodoListProps {
  todos: Todo[];
  comments: Comments[];
  fetchTodos: () => void;
  fetchComments: () => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  comments,
  fetchTodos,
  fetchComments,
}) => {
  return (
    <ul>
      {todos.map((todo) => {
        const todoComment = comments.find((cmt) => cmt.taskId === todo.id);
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            fetchTodos={fetchTodos}
            fetchComments={fetchComments}
            comment={todoComment || { id: "0", taskId: "0", comment: "" }}
          />
        );
      })}
    </ul>
  );
};

export default TodoList;
