export interface Comment {
  _id: string;
  task: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  taskId: string;
  text: string;
}
