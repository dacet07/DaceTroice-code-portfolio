import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import TodoHeader from "./components/TodoHeader";
import ViewItemPage from "./pages/ViewItemPage";
import { Todo, Comments } from "./types";

const apiUrl = "http://localhost:3004/posts";
const apiUrlComments = "http://localhost:3004/comments";

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [comments, setComments] = useState<Comments[]>([]);

  const fetchTodos = async () => {
    try {
      const response = await fetch(apiUrl);
      const data: Todo[] = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(apiUrlComments);
      const data: Comments[] = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchComments();
  }, []);

  return (
    <Router>
      <TodoHeader />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <TodoForm fetchTodos={fetchTodos} />
              <TodoList
                todos={todos}
                comments={comments}
                fetchTodos={fetchTodos}
                fetchComments={fetchComments}
              />
            </div>
          }
        />
        <Route
          path="/view/:id"
          element={<ViewItemPage todos={todos} comments={comments} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
