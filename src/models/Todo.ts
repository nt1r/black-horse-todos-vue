class Todo {
  id: number;
  content: string;
  isCompleted: boolean;
  createDate: Date;
  constructor(id: number, content: string) {
    this.id = id;
    this.content = content;
    this.isCompleted = false;
    this.createDate = new Date();
  }
}

export default Todo;
