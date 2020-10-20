class TodoVM {
  id: number;

  content: string;

  isCompleted: boolean;

  constructor(id: number, content: string) {
    this.id = id;
    this.content = content;
    this.isCompleted = false;
  }
}

export default TodoVM;
