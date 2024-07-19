import React from "react";
import TodoItemView from "../components/TodoItemView";
import Button from "../components/Button";
import { Todo, Comments } from "../types";
import { Link } from "react-router-dom";

interface ViewItemPageProps {
  todos: Todo[];
  comments: Comments[];
}

const ViewItemPage: React.FC<ViewItemPageProps> = ({ todos, comments }) => {
  return (
    <div>
      <Link to="/">
        <Button type="input" label="Back" />
      </Link>
      <TodoItemView todos={todos} comments={comments} />
    </div>
  );
};

export default ViewItemPage;
