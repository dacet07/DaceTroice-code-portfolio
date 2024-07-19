import React from "react";
import { useParams } from "react-router-dom";
import { Todo, Comments } from "../types";

interface TodoItemViewProps {
  todos: Todo[];
  comments: Comments[];
}

const TodoItemView: React.FC<TodoItemViewProps> = ({ todos, comments }) => {
  const { id } = useParams<{ id: string }>();
  const todo = todos.find((todo) => todo.id === id);
  const todoComments = comments.filter((comment) => comment.taskId === id);

  if (!todo) {
    return <div>Todo not found</div>;
  }

  return (
    <div className="listItem listItem--big">
      <div className="listItem__task listItem__task--big">
        <h3 className="listItem__task__title">{todo.title}</h3>
        <p className="listItem__task__content listItem__task__content--big">
          {todo.content}
        </p>
        {todoComments.map((comment) => (
          <p
            className="listItem__task__comment listItem__task__comment--big"
            key={comment.id}
          >
            {comment.comment}
          </p>
        ))}
      </div>
    </div>
  );
};

export default TodoItemView;
