import React from "react";
import TodoInput from "./TodoInput";

interface TodoFormProps {
  fetchTodos: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ fetchTodos }) => {
  return <TodoInput fetchTodos={fetchTodos} edit={false} editComment={false} />;
};

export default TodoForm;
