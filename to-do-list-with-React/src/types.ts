export interface Todo {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  commented: boolean;
}

export interface Comments {
  id: string;
  taskId: string;
  comment: string;
}
