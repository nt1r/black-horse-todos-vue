class Todo {
  id: number;

  content: string;

  isCompleted: boolean;

  createDate: Date;

  constructor(id: number, content: string, isCompleted?: boolean) {
    this.id = id;
    this.content = content;
    this.isCompleted = isCompleted === undefined ? false : isCompleted;
    this.createDate = new Date();
  }
}

export default Todo;
